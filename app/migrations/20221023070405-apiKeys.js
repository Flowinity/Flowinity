"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      userId: {
        type: Sequelize.BIGINT
      },
      scopes: {
        type: Sequelize.STRING,
        defaultValue: "*"
      },
      type: {
        type: Sequelize.ENUM(["api", "session"])
      },
      expiredAt: {
        type: Sequelize.DATE
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
    // index
    await queryInterface.addIndex("Sessions", ["token"])
    await queryInterface.addIndex("Sessions", ["userId"])
    await queryInterface.addIndex("Sessions", ["type"])
    await queryInterface.addIndex("Sessions", ["scopes"])
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
