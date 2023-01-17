module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("feedback", "userId", {
        type: Sequelize.BIGINT
      })
    ])
  }
}
