"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "openGraphColor")
    await queryInterface.removeColumn("Users", "openGraphSiteName")
    await queryInterface.removeColumn("Users", "openGraphSiteURL")
    await queryInterface.removeColumn("Users", "openGraphAuthor")
    await queryInterface.removeColumn("Users", "openGraphAuthorURL")
    await queryInterface.removeColumn("Users", "openGraphTitle")
    await queryInterface.removeColumn("Users", "openGraphDescription")
    await queryInterface.removeColumn("Users", "discordOAuth")
    await queryInterface.removeColumn("Users", "discordId")
    await queryInterface.removeColumn("Users", "discordUserCache")
    await queryInterface.removeColumn("Users", "discordPublic")
    await queryInterface.removeColumn("Users", "discordRefreshToken")
    await queryInterface.removeColumn("Users", "totalNotifications")
    await queryInterface.removeColumn("Users", "totalUploads")
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
