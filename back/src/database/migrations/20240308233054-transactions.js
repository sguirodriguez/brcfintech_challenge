'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      walletSenderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'wallet_sender_id',
        references:{
          model: 'wallets',
          key: 'id'
        }
      },
      walletReceiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'wallet_receiver_id',
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
      amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
      },
      kind: {
        type: Sequelize.ENUM({
          values: ['credit', 'debit']
        }),
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
    await queryInterface.dropTable('transactions')
  }
};
