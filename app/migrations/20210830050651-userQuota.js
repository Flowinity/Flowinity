module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "quota", {
        type: Sequelize.BIGINT,
        defaultValue: 0
      })
    ])
  }
}
