module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("transactions", "createdAt", {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn("transactions", "updatedAt", {
        type: Sequelize.DATE
      })
    ])
  }
}
