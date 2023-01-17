"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AutoCollectRules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      collectionId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Collections",
          key: "id"
        }
      },
      requireApproval: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      rules: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      userId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Users",
          key: "id"
        }
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

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
