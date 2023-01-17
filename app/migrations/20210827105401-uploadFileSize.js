module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("uploads", "fileSize", {
        type: Sequelize.BIGINT,
        defaultValue: 0
      })
    ])
  }
}
