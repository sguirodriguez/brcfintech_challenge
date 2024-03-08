'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      walletId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'wallet_id',
        references:{
          model: 'wallets',
          key: 'id'
        }
      },
      currencyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'currency_id',
        references:{
          model: 'currencies',
          key: 'id'
        }
      },
      currencyAmount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        field: 'currency_amount'
      },
      amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('buy' | 'sell'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending' | 'completed' | 'canceled'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "updated_at",
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orders')
  }
};
