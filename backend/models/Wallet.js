"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wallet.hasOne(models.User, {
        foreignKey: "walletId",
        as: "user",
      });
    }
  }
  Wallet.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Wallet",
      tableName: "wallets",
      timestamps: true,
    }
  );

  return Wallet;
};
