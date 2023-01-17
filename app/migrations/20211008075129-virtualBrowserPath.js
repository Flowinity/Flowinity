module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("uploads", "path", {
        type: Sequelize.TEXT
      })
    ])
  }
}
