"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "fcmNotificationKey", {
      type: Sequelize.TEXT,
      allowNull: true
    })

    await queryInterface.createTable("FCMDevices", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      registrationKey: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      invalid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      notificationKey: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "fcmNotificationKey")
    await queryInterface.dropTable("FCMDevices")
  }
}
