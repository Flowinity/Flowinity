module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "fakePath", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.addColumn("users", "fakePathValue", {
        type: Sequelize.STRING,
        defaultValue: "https://jays.host/[attachment.fileName]"
      })
    ])
  }
}
