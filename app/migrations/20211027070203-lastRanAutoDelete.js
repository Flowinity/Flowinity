module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "automatedRemovalLastRan", {
        type: Sequelize.DATE
      })
    ])
  }
}
