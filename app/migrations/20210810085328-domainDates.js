module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("domains", "createdAt", {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn("domains", "updatedAt", {
        type: Sequelize.DATE
      })
    ])
  }
}
