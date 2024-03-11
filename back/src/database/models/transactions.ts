import { Model } from "sequelize";
import sequelize from "sequelize";
import db from "./index";
import Wallets from "./wallets";
import Currencies from "./currencies";

class Transactions extends Model {
  declare id: number;
  declare walletSenderId: number;
  declare walletReceiverId: number;
  declare currencyId: number;
  declare amount: number;
  declare kind: string;
  declare createdAt: string;
  declare updatedAt: string;
}

Transactions.init(
  {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    walletSenderId: {
      type: sequelize.INTEGER,
      allowNull: false,
      field: "wallet_sender_id",
      references: {
        model: "wallets",
        key: "id",
      },
    },
    walletReceiverId: {
      type: sequelize.INTEGER,
      allowNull: false,
      field: "wallet_receiver_id",
      references: {
        model: "wallets",
        key: "id",
      },
    },
    currencyId: {
      type: sequelize.INTEGER,
      allowNull: false,
      field: "currency_id",
      references: {
        model: "currencies",
        key: "id",
      },
    },
    amount: {
      type: sequelize.DECIMAL(20, 8),
      allowNull: false,
    },
    kind: {
      type: sequelize.ENUM({
        values: ["credit", "debit"],
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
    },
  },
  {
    sequelize: db,
    tableName: "transactions",
    underscored: true,
  }
);

Transactions.belongsTo(Wallets, {
  foreignKey: "walletSenderId",
  as: "senderWallet",
});

Transactions.belongsTo(Wallets, {
  foreignKey: "walletReceiverId",
  as: "receiverWallet",
});

Transactions.belongsTo(Currencies, {
  foreignKey: "currencyId",
  as: "currencies",
});

export default Transactions;
