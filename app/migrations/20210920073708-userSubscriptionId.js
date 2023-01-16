module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "subscriptionId", {
        type: Sequelize.BIGINT,
        defaultValue: null
      })
    ])
  }
}
