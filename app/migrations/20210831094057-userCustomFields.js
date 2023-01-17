module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "invisibleURLs", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ])
  }
}
