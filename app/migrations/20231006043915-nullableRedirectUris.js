"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("OauthApps", "redirectUri", {
      type: Sequelize.STRING,
      allowNull: true
    })
  }
}
