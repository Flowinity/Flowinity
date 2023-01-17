module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "domainId", {
        type: Sequelize.BIGINT
      })
    ])
  }
}
