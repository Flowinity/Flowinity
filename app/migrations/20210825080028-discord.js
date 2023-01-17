module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "discordId", {
        type: Sequelize.BIGINT,
        defaultValue: null,
        default: null
      }),
      queryInterface.addColumn("users", "discordOAuth", {
        type: Sequelize.BIGINT,
        defaultValue: null,
        default: null
      })
    ])
  }
}
