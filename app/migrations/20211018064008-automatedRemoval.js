module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "automatedRemoval", {
        type: Sequelize.ENUM(["disabled", "interval", "fileAge"]),
        defaultValue: "disabled"
      }),
      queryInterface.addColumn("users", "automatedRemovalTime", {
        type: Sequelize.BIGINT,
        defaultValue: 0
      })
    ])
  }
}
