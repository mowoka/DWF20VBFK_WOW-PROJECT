const { User, Profile } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate({
      email: req.body.email,
      password: req.body.password,
    });

    if (error) {
      return res.send({
        message: error.details[0].message,
      });
    }

    const cekEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (cekEmail) {
      return res.send({
        message: "Email Already Register",
      });
    }

    const hassedStrength = 10;
    const hassedPassword = await bcrypt.hash(password, hassedStrength);

    await User.create({
      ...req.body,
      password: hassedPassword,
      role: "User",
    });

    const user = User.findOne({
      where: {
        email,
      },
    });

    const secretKey = "Mokaz-Dev";
    const token = jwt.sign(
      {
        id: user.id,
      },
      secretKey
    );

    const getUser = await User.findOne({
      where: {
        email,
      },
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: [
            "id",
            "userId",
            "createdAt",
            "updatedAt",
            "password",
            "role",
            "email",
          ],
        },
      },
    });

    res.send({
      status: "Success",
      message: "Register Success",
      data: {
        user: {
          id: getUser.id,
          email: getUser.email,
          fullName: getUser.fullName,
          role: getUser.role,
          profile: getUser.profile,
          token,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate({
      email: req.body.email,
      password: req.body.password,
    });

    if (error) {
      return res.send({
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: [
            "id",
            "userId",
            "createdAt",
            "updatedAt",
            "password",
            "role",
            "email",
          ],
        },
      },
    });

    if (!user) {
      return res.send({
        message: "Your Credential is not valid",
      });
    }

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.send({
        message: "Your Credential is not valid",
      });
    }

    const secretKey = "Mokaz-Dev";
    const token = jwt.sign(
      {
        id: user.id,
      },
      secretKey
    );

    res.send({
      status: "Success",
      message: "Login Success",
      data: {
        user: {
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          profile: user.profile,
          token,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.cekAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: [
            "id",
            "userId",
            "createdAt",
            "updatedAt",
            "password",
            "role",
            "email",
          ],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!user) {
      return res.send({
        message: "User Not Found",
      });
    }

    res.send({
      status: "Success",
      message: "User Valid",
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

// exports.dummy = async (req, res) => {
//   try {
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       message: "Server Error",
//     });
//   }
// };
