module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("transactions", "hidden", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.addColumn("transactions", "coinbaseId", {
        type: Sequelize.UUID,
        defaultValue: null
      })
    ])
  }
}
