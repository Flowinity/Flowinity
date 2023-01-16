module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "moderator", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ])
  }
}
