module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "inviteEntitlementBan", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        default: false
      })
    ])
  }
}
