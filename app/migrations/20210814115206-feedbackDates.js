module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("feedback", "createdAt", {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn("feedback", "updatedAt", {
        type: Sequelize.DATE
      })
    ])
  }
}
