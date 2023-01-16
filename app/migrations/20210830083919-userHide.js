module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "uploadNameHidden", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ])
  }
}
