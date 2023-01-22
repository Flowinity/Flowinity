module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "avatar", {
        type: Sequelize.STRING,
        defaultValue: null,
        default: null
      })
    ])
  }
}
