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
    switch (queryInterface.sequelize.options.dialect) {
      case "mariadb": {
        const sql = await fs.readFileSync(__dirname + "/initial.sql")
        let promises = []
        const statements = sql.toString().split(";")

        for (const statement of statements)
          if (statement.trim() !== "")
            promises.push(queryInterface.sequelize.query(statement))

        return Promise.all(promises)
      }
      case "sqlite": {
        const sql = await fs.readFileSync(__dirname + "/sqlite.sql")
        let promises = []
        const statements = sql.toString().split(";")

        for (const statement of statements)
          if (statement.trim() !== "")
            promises.push(queryInterface.sequelize.query(statement))

        return Promise.all(promises)
      }
      default:
        if (queryInterface.sequelize.options.dialect === "mysql") {
          throw new Error(
            "Dialect mysql not supported. Please use mariadb instead!"
          )
        } else {
          throw new Error("Dialect not supported")
        }
    }
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
