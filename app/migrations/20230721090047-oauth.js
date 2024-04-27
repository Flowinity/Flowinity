"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OauthApps", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataType.STRING,
        allowNull: false
      },
      icon: {
        type: DataType.STRING,
        allowNull: true
      },
      shortCode: {
        type: DataType.STRING,
        allowNull: false
      },
      verified: {
        type: DataType.BOOLEAN,
        defaultValue: false
      },
      redirectUri: {
        type: DataType.STRING,
        allowNull: false
      },
      secret: {
        type: DataType.STRING,
        allowNull: false
      },
      description: {
        type: DataType.STRING,
        allowNull: true
      },
      scopes: {
        type: DataType.STRING,
        allowNull: false,
        defaultValue:
          "oauth.user.username,oauth.user.id,oauth.user.email,oauth.save"
      },
      userId: {
        type: DataType.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      createdAt: {
        type: DataType.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataType.DATE,
        allowNull: false
      }
    })

    await queryInterface.createTable("OauthSaves", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataType.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      oauthAppId: {
        type: DataType.UUID,
        allowNull: false,
        references: {
          model: "OauthApps",
          key: "id"
        }
      },
      data: {
        type: DataType.JSON,
        allowNull: true
      },
      createdAt: {
        type: DataType.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataType.DATE,
        allowNull: false
      },
      history: {
        type: DataType.JSON,
        allowNull: false,
        defaultValue: []
      }
    })

    await queryInterface.changeColumn("Sessions", "type", {
      type: DataType.ENUM("session", "api", "oauth"),
      allowNull: false
    })

    await queryInterface.addColumn("Sessions", "oauthAppId", {
      type: DataType.UUID,
      allowNull: true,
      references: {
        model: "OauthApps",
        key: "id"
      }
    })

    await queryInterface.addIndex("OauthApps", ["userId"])
    await queryInterface.addIndex("OauthSaves", ["userId"])
    await queryInterface.addIndex("OauthSaves", ["oauthAppId"])
    await queryInterface.addIndex("Sessions", ["oauthAppId"])
  }
}
