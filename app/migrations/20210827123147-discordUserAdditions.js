module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "discordUserCache", {
        type: Sequelize.JSON,
        defaultValue: {}
      }),
      queryInterface.addColumn("users", "discordPublic", {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
    ])
  }
}
