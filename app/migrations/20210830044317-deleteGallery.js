module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("uploads", "deletable", {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
    ])
  }
}
