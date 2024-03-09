import { Model } from "sequelize";
import sequelize from "sequelize";
import db from "./index";
import Wallets from "./wallets";
import Currencies from "./currencies";

class Orders extends Model {
  declare id: number;
  declare walletId: number;
  declare currencyId: number;
  declare currencyAmount: number;
  declare amount: number;
  declare type: string;
  declare status: string;
  declare createdAt: string;
  declare updatedAt: string;
}

Orders.init(
  {
      id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      walletId: {
        type: sequelize.INTEGER,
        allowNull: false,
        field: 'wallet_id',
        references:{
          model: 'wallets',
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
      currencyAmount: {
        type: sequelize.DECIMAL(20, 8),
        allowNull: false,
        field: 'currency_amount'
      },
      amount: {
        type: sequelize.DECIMAL(20, 8),
        allowNull: false,
      },
      type: {
        type: sequelize.ENUM({
          values: ['buy', 'sell']
        }),
        allowNull: false,
      },
      status: {
        type:  sequelize.ENUM({
          values: ['pending', 'completed', 'canceled']
        }),
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
    tableName: "orders",
    underscored: true,
  }
);

Orders.belongsTo(Wallets, {
  foreignKey: 'walletId',
  as: 'wallets',
})

Orders.belongsTo(Currencies, {
  foreignKey: 'currencyId',
  as: 'currencies',
})

export default Orders
