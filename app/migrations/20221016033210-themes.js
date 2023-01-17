"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "themeId", {
      type: Sequelize.BIGINT,
      defaultValue: 1
    })
    await queryInterface.createTable("Themes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: "A Colubrina Theme"
      },
      userId: {
        type: Sequelize.BIGINT
      },
      public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      theme: {
        type: Sequelize.JSON,
        defaultValue: {
          name: "A TPU Theme",
          primaryType: "all",
          dark: {
            primary: "#0190ea",
            secondary: "#757575",
            accent: "#000000",
            error: "#ff1744",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#ff9800",
            card: "#151515",
            toolbar: "#191919",
            sheet: "#181818",
            text: "#000000",
            dark: "#151515",
            nav: "#FFFFFF",
            calendarNormalActivity: "#3f51b5",
            calendarActivityType7: "#f44336",
            calendarActivityType8: "#4caf50",
            calendarActivityType10: "#ff9800",
            calendarExternalActivity: "#2196f3"
          },
          light: {
            primary: "#0190ea",
            secondary: "#757575",
            accent: "#000000",
            error: "#ff1744",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#ff9800",
            card: "#151515",
            toolbar: "#191919",
            sheet: "#181818",
            text: "#000000",
            dark: "#151515",
            nav: "#FFFFFF",
            calendarNormalActivity: "#3f51b5",
            calendarActivityType7: "#f44336",
            calendarActivityType8: "#4caf50",
            calendarActivityType10: "#ff9800",
            calendarExternalActivity: "#2196f3"
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
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
