import { Model, DataTypes, Transaction } from "sequelize";
import sequelize from "./index";
import Users from "./users";
import Currencies from "./currencies";

class Wallets extends Model {
  id!: number;
  userId!: number;
  currencyId!: number;
  balance!: number;
  createdAt!: Date;
  updatedAt!: Date;

  static async bulkUpdate(
    updates: { balance: number; id: any }[],
    options: { transaction: Transaction }
  ): Promise<number[]> {
    const updatedRows: number[] = [];

    for (const update of updates) {
      const [numUpdatedRows] = await this.update(
        { balance: update.balance },
        { where: { id: update.id }, transaction: options.transaction }
      );

      updatedRows.push(numUpdatedRows);
    }

    return updatedRows;
  }
}

Wallets.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: Users,
        key: "id",
      },
    },
    currencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "currency_id",
      references: {
        model: Currencies,
        key: "id",
      },
    },
    balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "wallets",
    underscored: true,
  }
);

Wallets.belongsTo(Users, {
  foreignKey: "userId",
  as: "users",
});

Wallets.belongsTo(Currencies, {
  foreignKey: "currencyId",
  as: "currencies",
});

export default Wallets;
