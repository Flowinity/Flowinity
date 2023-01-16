module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "passwordResetCode", {
        type: Sequelize.STRING,
        defaultValue: null
      }),
      queryInterface.addColumn("users", "passwordResetEnabled", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.addColumn("users", "passwordResetExpiry", {
        type: Sequelize.DATE,
        defaultValue: null
      })
    ])
  }
}
