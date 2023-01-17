module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "inviteId", {
        type: Sequelize.BIGINT
      })
    ])
  }
}
