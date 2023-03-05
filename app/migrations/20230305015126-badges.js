"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Badges", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tooltip: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      planId: {
        type: Sequelize.INTEGER
      },
      unlocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    })
    await queryInterface.createTable("BadgeAssociations", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      badgeId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expiredAt: {
        type: Sequelize.DATE
      },
      hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BadgeAssociations")
    await queryInterface.dropTable("Badges")
  }
}
