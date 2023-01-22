"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.BIGINT
      },
      paymentMethodType: {
        type: Sequelize.ENUM([
          "crypto",
          "paypal",
          "manual",
          "stripe",
          "credits"
        ]),
        defaultValue: "manual"
      },
      paymentMethodId: {
        type: Sequelize.BIGINT,
        defaultValue: null
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("transactions")
  }
}
