module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("subdomains", "advanced", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ])
  }
}
