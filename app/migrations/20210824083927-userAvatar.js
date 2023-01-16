module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "avatar", {
        type: Sequelize.STRING(191),
        defaultValue: null,
        default: null
      })
    ])
  }
}
