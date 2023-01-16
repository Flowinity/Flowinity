module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "subdomainId", {
        type: Sequelize.BIGINT,
        unique: true,
        defaultValue: null
      })
    ])
  }
}
