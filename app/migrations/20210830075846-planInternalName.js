module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("plans", "internalName", {
        type: Sequelize.STRING(191)
      })
    ])
  }
}
