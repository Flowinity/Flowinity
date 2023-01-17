module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "openGraphCustomFields", {
        type: Sequelize.JSON,
        defaultValue: {}
      })
    ])
  }
}
