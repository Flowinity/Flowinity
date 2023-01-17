module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "planId", {
        type: Sequelize.BIGINT,
        defaultValue: 1
      })
    ])
  }
}
