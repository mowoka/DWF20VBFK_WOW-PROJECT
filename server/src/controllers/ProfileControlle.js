const { Profile, User } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");

exports.getProfiles = async (req, res) => {
  try {
    const profile = await Profile.findAll({
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "role", "id"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    if (!profile) {
      res.send({
        message: "Profile Data is null",
      });
    }

    res.send({
      status: "Successs",
      message: "Profile Successfully Retreived ",
      data: {
        profile,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.addProfile = async (req, res) => {
  try {
    const { gender, noHp, alamat } = req.body;
    const schema = Joi.object({
      userId: Joi.number().integer().min(1).required(),
      gender: Joi.string().min(3).required(),
      noHp: Joi.string().min(8).required(),
      alamat: Joi.string().min(5).required(),
      profileImage: Joi.string().min(3).required(),
    });

    const { error } = schema.validate({
      userId: req.user.id,
      gender: gender,
      noHp: noHp,
      alamat: alamat,
      profileImage: req.files.profileImage[0].filename,
    });

    if (error) {
      const fileName = req.files.profileImage[0].filename;
      const locals = path.join(__dirname, "..", "..", "uploads");
      const filePath = path.join(locals, fileName);
      fs.unlinkSync(filePath);

      return res.send({
        message: error.details[0].message,
      });
    }

    const cekProfile = await Profile.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (cekProfile) {
      const fileName = req.files.profileImage[0].filename;
      const locals = path.join(__dirname, "..", "..", "uploads");
      const filePath = path.join(locals, fileName);
      fs.unlinkSync(filePath);

      return res.send({
        status: "Warning",
        message: "Your Profile already exist",
        data: {
          profile: cekProfile,
        },
      });
    }

    const profile = await Profile.create({
      userId: req.user.id,
      gender: gender,
      noHp: noHp,
      alamat: alamat,
      profileImage: req.files.profileImage[0].filename,
    });

    res.send({
      status: "Success",
      message: "Profile Successfully added",
      data: {
        profile,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        userId: req.user.id,
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "role", "email"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!profile) {
      return res.send({
        message: `profile with id ${req.user.id} Not Found`,
      });
    }

    res.send({
      status: "Success",
      message: `Profile with id ${req.user.id} Successfully Retreived`,
      data: {
        profile,
        link: `http://localhost:5000/uploads/${profile.profileImage}`,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};
exports.editProfile = async (req, res) => {
  try {
    const cekprofile = await Profile.findOne({
      where: {
        userId: req.user.id,
      },
      include: {
        model: User,
        as: "user",
      },
    });

    if (!cekprofile) {
      return res.send({
        message: `profile with id ${req.user.id} Not Found`,
      });
    }

    const { gender, noHp, alamat } = req.body;

    await Profile.update(
      {
        gender: gender,
        noHp: noHp,
        alamat: alamat,
        profileImage: req.files.profileImage[0].filename,
      },
      {
        where: {
          userId: req.user.id,
        },
      }
    );

    const profile = await Profile.findOne({
      where: {
        userId: req.user.id,
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "role", "email"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success",
      message: `Profile with id ${req.user.id} Successfully Retreived`,
      data: {
        profile,
        link: `http://localhost:5000/uploads/${profile.profileImage}`,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};
exports.addInstanceProfile = async (req, res) => {
  try {
    const { gender, noHp, alamat } = req.body;
    // const schema = Joi.object({
    //   userId: Joi.number().integer().min(1).required(),
    //   gender: Joi.string().min(3).required(),
    //   noHp: Joi.string().min(8).required(),
    //   alamat: Joi.string().min(5).required(),
    // });

    // const { error } = schema.validate({
    //   userId: req.user.id,
    //   gender: gender,
    //   noHp: noHp,
    //   alamat: alamat,
    // });

    // if (error) {
    //   return res.send({
    //     message: error.details[0].message,
    //   });
    // }

    const cekProfile = await Profile.findOne({
      where: {
        userId: req.user.id,
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
    });

    if (cekProfile) {
      return res.send({
        status: "Warning",
        message: "Your Profile already exist",
        data: {
          profile: cekProfile,
        },
      });
    }

    const profile = await Profile.create({
      userId: req.user.id,
      gender: gender,
      noHp: noHp,
      alamat: alamat,
      profileImage: "image",
    });

    const getProfile = await Profile.findOne({
      where: {
        userId: req.user.id,
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
    });

    const secretKey = "Mokaz-Dev";
    const token = jwt.sign(
      {
        id: getProfile.user.id,
      },
      secretKey
    );

    res.send({
      status: "Success",
      message: "Instance Successfully added",
      data: {
        profile: getProfile,
        token,
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
// console.log(err);
// res.status(500).send({
//   message: "Server Error",
// });
// }
// };
