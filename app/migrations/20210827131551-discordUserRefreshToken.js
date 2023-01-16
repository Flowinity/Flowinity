module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "discordRefreshToken", {
        type: Sequelize.STRING(191),
        defaultValue: null
      })
    ])
  }
}
