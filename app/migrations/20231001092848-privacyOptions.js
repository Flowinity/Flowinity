"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "pulse", {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
    await queryInterface.addColumn("Users", "groupPrivacy", {
      type: Sequelize.ENUM(["FRIENDS", "NOBODY"]),
      defaultValue: "FRIENDS"
    })
    await queryInterface.addColumn("Users", "friendRequests", {
      type: Sequelize.ENUM(["EVERYONE", "NOBODY"]),
      defaultValue: "EVERYONE"
    })
  }
}
