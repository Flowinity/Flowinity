"use strict"
const fs = require("fs")

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const sql = await fs.readFileSync(__dirname + "/initial.sql")
    let promises = []
    const statements = sql.toString().split(";")
    for (const statement of statements)
      if (statement.trim() !== "")
        promises.push(queryInterface.sequelize.query(statement))
    return Promise.all(promises)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
