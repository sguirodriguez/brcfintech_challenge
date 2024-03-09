import { Model } from "sequelize";
import sequelize from "sequelize";
import db from "./index";

class Currencies extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare symbol: string;
  declare value: number;
  declare createdAt: string;
  declare updatedAt: string;
}

Currencies.init(
  {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: sequelize.STRING,
      },
      symbol: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: sequelize.DECIMAL(20, 8),
        allowNull: false,
      },
      createdAt: {
        type: sequelize.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: sequelize.DATE,
        allowNull: false,
        field: "updated_at",
      }
  },
  {
    sequelize: db,
    tableName: "currencies",
    underscored: true,
  }
);

export default Currencies
