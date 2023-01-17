"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      username: {
        type: Sequelize.STRING(191),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: "Hey, I'm a new user here!"
      },
      apiKey: {
        type: Sequelize.STRING
      },
      darkTheme: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      administrator: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      totalUploads: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalNotifications: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      banned: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users")
  }
}
