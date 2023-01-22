module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "totpSecret", {
        type: Sequelize.STRING,
        defaultValue: null
      })
    ])
  }
}
