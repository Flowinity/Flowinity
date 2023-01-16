module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "totpEnable", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ])
  }
}
