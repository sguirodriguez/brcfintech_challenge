import { Model } from "sequelize";
import sequelize from "sequelize";
import db from "./index";
import Users from "./users";
import Currencies from "./currencies";

class Wallets extends Model {
  declare id: number;
  declare userId: number;
  declare currencyId: number;
  declare balance: number;
  declare createdAt: string;
  declare updatedAt: string;
}

Wallets.init(
  {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: sequelize.INTEGER,
        allowNull: false,
        field: 'user_id',
        references:{
          model: 'users',
          key: 'id'
        }
      },
      currencyId: {
        type: sequelize.INTEGER,
        allowNull: false,
        field: 'currency_id',
        references:{
          model: 'currencies',
          key: 'id'
        }
      },
      balance: {
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
    tableName: "wallets",
    underscored: true,
  }
);

Wallets.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'users',
})

Wallets.belongsTo(Currencies, {
  foreignKey: 'currencyId',
  as: 'currencies',
})

export default Wallets
