module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "premium", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.addColumn("users", "beta", {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
    ])
  }
}
