module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("domains", "subdomains", {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
    ])
  }
}
