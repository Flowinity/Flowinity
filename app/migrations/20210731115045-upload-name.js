module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("uploads", "name", {
        type: Sequelize.TEXT,
        defaultValue: "Unknown",
        default: "Unknown"
      }),
      queryInterface.addColumn("uploads", "originalFilename", {
        type: Sequelize.TEXT,
        defaultValue: "Unknown",
        default: "Unknown"
      })
    ])
  }
}
