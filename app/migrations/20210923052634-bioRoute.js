module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("bios", "route", {
        type: Sequelize.STRING,
        unique: true
      })
    ])
  }
}
