module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("domains", "customUserEligibility", {
        type: Sequelize.JSON,
        defaultValue: []
      }),
      queryInterface.addColumn("domains", "restricted", {
        type: Sequelize.ENUM(["disabled", "user", "premium"]),
        defaultValue: "disabled"
      })
    ])
  }
}
