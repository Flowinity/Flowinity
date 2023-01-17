module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "flowinityId", {
        type: Sequelize.TEXT
      })
    ])
  }
}
