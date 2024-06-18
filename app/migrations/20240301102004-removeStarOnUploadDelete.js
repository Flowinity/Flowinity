"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint("Stars", "stars_ibfk_2")
      await queryInterface.changeColumn("Stars", "attachmentId", {
        type: Sequelize.BIGINT,
        references: {
          model: "Uploads",
          key: "id"
        },
        onDelete: "CASCADE"
      })
    } catch {}
  }
}
