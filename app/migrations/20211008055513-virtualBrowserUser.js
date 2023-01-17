module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("folders", "userId", {
        type: Sequelize.BIGINT
      })
    ])
  }
}
