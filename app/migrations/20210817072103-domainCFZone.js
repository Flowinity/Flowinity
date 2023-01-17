module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("domains", "zone", {
        type: Sequelize.STRING(191),
        unique: true,
        defaultValue: null
      }),
      queryInterface.addColumn("domains", "advanced", {
        type: Sequelize.STRING(191),
        defaultValue: false
      })
    ])
  }
}
