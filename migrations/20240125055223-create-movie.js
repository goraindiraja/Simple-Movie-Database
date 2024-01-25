'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      director: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      genre: {
        type: Sequelize.STRING
      },
      votes: {
        type: Sequelize.INTEGER
      },
      trailerURL: {
        type: Sequelize.STRING
      },
      imageURL: {
        type: Sequelize.TEXT
      },
      synopsis: {
        type: Sequelize.TEXT
      },
      RatingId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ratings',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movies');
  }
};