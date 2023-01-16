module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("plans", "icon", {
        type: Sequelize.STRING(191),
        defaultValue: "mdi-plus"
      })
    ])
  }
}
