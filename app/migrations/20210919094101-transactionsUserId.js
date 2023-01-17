module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("transactions", "userId", {
        type: Sequelize.BIGINT
      })
    ])
  }
}
