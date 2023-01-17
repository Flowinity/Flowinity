module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("subdomains", "createdAt", {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn("subdomains", "updatedAt", {
        type: Sequelize.DATE
      })
    ])
  }
}
