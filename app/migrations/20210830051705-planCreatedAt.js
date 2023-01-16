module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("plans", "createdAt", {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn("plans", "updatedAt", {
        type: Sequelize.DATE
      })
    ])
  }
}
