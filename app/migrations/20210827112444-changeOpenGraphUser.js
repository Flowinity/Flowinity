module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("users", "openGraphSiteName", {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.changeColumn("users", "openGraphAuthor", {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.changeColumn("users", "openGraphTitle", {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.changeColumn("users", "openGraphDescription", {
        type: Sequelize.TEXT,
        allowNull: true
      })
    ])
  }
}
