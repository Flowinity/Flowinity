module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("uploads", "folderId", {
        type: Sequelize.BIGINT
      })
    ])
  }
}
