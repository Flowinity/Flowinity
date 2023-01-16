module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("uploads", "type", {
        type: Sequelize.ENUM([
          "image",
          "video",
          "link",
          "binary",
          "text",
          "audio"
        ])
      }),
      queryInterface.addColumn("uploads", "urlRedirect", {
        type: Sequelize.TEXT
      })
    ])
  }
}
