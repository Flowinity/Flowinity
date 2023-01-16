module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "openGraph", {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }),
      queryInterface.addColumn("users", "openGraphColor", {
        type: Sequelize.STRING(191),
        defaultValue: "#4DBA87"
      }),
      queryInterface.addColumn("users", "openGraphSiteName", {
        type: Sequelize.STRING(191),
        defaultValue: "Jays.host"
      }),
      queryInterface.addColumn("users", "openGraphSiteURL", {
        type: Sequelize.STRING(191),
        defaultValue: "https://jays.host"
      }),
      queryInterface.addColumn("users", "openGraphAuthor", {
        type: Sequelize.STRING(191),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "openGraphAuthorURL", {
        type: Sequelize.STRING(191),
        defaultValue: null
      }),
      queryInterface.addColumn("users", "openGraphTitle", {
        type: Sequelize.STRING(191),
        defaultValue: "[attachment.name]"
      }),
      queryInterface.addColumn("users", "openGraphDescription", {
        type: Sequelize.STRING(191),
        defaultValue: "Uploaded by: [user.username]"
      })
    ])
  }
}
