const { User } = require("../../models");

exports.getUser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "role", "password"],
      },
    });

    if (!users) {
      return res.status(400).send({
        message: "user is not found",
      });
    }

    res.send({
      status: "Success",
      message: "User Successfully Retreived",
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.delUser = async (req, res) => {
  try {
    const { id } = req.params;

    const finduser = User.findOne({
      where: {
        id,
      },
    });

    if (!finduser) {
      return res.send({
        status: "Error",
        message: "user not found",
      });
    }

    await User.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      message: "user success deleted",
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
