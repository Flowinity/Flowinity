module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "credits", {
        type: Sequelize.BIGINT,
        defaultValue: 0
      })
    ])
  }
}
