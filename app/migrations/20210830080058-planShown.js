module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("plans", "purchasable", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ])
  }
}
