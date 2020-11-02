'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      cook_time: {
        type: Sequelize.STRING
      },
      course: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      picture: {
        type: Sequelize.STRING
      },
      ingredients: {
        type: Sequelize.TEXT
      },
      directions: {
        type: Sequelize.TEXT
      },
      notes: {
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {model: 'Users', field: 'id'}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Recipes');
  }
};