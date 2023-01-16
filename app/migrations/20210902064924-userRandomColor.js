module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "openGraphRandomColor", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ])
  }
}
