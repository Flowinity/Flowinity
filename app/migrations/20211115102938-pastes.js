module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("uploads", "type", {
        type: Sequelize.ENUM([
          "image",
          "video",
          "link",
          "binary",
          "text",
          "audio",
          "paste",
          "dir"
        ]),
        defaultValue: "binary",
        allowNull: false
      })
    ])
  }
}
