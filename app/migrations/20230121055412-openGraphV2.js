"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "openGraph", {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {
        enabled: false,
        color: "#0190ea",
        siteName: "TroploPrivateUploader",
        siteURL: "https://images.flowinity.com",
        author: "",
        authorURL: null,
        title: "[attachment.name]",
        description: "Uploaded by [user.username]",
        customFields: []
      }
    })
  },

  async down(queryInterface, Sequelize) {}
}
