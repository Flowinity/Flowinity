module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("inviteKeys", "createdAt", {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn("inviteKeys", "updatedAt", {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn("inviteKeys", "expiredAt", {
        type: Sequelize.DATE
      })
    ])
  }
}
