module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("plans", "internalFeatures", {
        type: Sequelize.JSON,
        defaultValue: null
      })
    ])
  }
}
