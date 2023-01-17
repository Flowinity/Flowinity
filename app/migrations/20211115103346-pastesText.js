module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("uploads", "data", {
        type: Sequelize.JSON,
        defaultValue: {}
      })
    ])
  }
}
