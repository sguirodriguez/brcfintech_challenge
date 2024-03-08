'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('wallets', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'user_id',
        references:{
          model: 'users',
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
      balance: {
        type: Sequelize.DECIMAL(20, 8),
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
    await queryInterface.dropTable('wallets')
  }
};
