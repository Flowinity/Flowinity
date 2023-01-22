module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("domains", "zone", {
        type: Sequelize.STRING,
        unique: true,
        defaultValue: null
      }),
      queryInterface.addColumn("domains", "advanced", {
        type: Sequelize.STRING,
        defaultValue: false
      })
    ])
  }
}
