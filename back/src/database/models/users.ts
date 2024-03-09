import { Model } from "sequelize";
import sequelize from "sequelize";
import db from "./index";

class Users extends Model {
  declare id: number;
  declare username: string;
  declare token: string;
  declare createdAt: string;
  declare updatedAt: string;
}

Users.init(
  {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    token: {
      type: sequelize.STRING,
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
    },
  },
  {
    sequelize: db,
    tableName: "users",
    underscored: true,
  }
);

export default Users
