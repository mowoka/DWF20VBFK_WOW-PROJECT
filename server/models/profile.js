"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
    }
  }
  Profile.init(
    {
      userId: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      noHp: DataTypes.INTEGER,
      alamat: DataTypes.STRING,
      profileImage: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};
