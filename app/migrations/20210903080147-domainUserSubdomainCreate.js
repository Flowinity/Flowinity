module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("domains", "subdomainsCreate", {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
    ])
  }
}
