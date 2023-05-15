"use strict"

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WorkspaceUsers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      recipientId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      write: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      configure: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      accepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.addIndex("WorkspaceUsers", ["workspaceId"])
    await queryInterface.addIndex("WorkspaceUsers", ["recipientId"])
    await queryInterface.addIndex("WorkspaceUsers", ["senderId"])
    await queryInterface.addIndex("WorkspaceUsers", ["read"])
    await queryInterface.addIndex("WorkspaceUsers", ["write"])
    await queryInterface.addIndex("WorkspaceUsers", ["configure"])
    await queryInterface.createTable("NoteVersions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      noteId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      data: {
        type: Sequelize.JSON,
        allowNull: false
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
    await queryInterface.addIndex("NoteVersions", ["noteId"])
    await queryInterface.addIndex("NoteVersions", ["userId"])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
