module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "inviteEntitlements", {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        default: 0
      })
    ])
  }
}
