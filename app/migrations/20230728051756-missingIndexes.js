"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("Experiments", ["userId"])
    await queryInterface.addIndex("Experiments", ["key"])

    await queryInterface.addIndex("Announcements", ["userId"])

    await queryInterface.addIndex("AutoCollectApprovals", ["userId"])
    await queryInterface.addIndex("AutoCollectApprovals", ["collectionId"])

    await queryInterface.addIndex("BadgeAssociations", ["userId"])
    await queryInterface.addIndex("BadgeAssociations", ["badgeId"])

    await queryInterface.addIndex("ChatAssociations", ["userId"])
    await queryInterface.addIndex("ChatAssociations", ["chatId"])
    await queryInterface.addIndex("ChatAssociations", ["legacyUserId"])

    await queryInterface.addIndex("Chats", ["userId"])
    await queryInterface.addIndex("Chats", ["legacyUserId"])

    await queryInterface.addIndex("Feedback", ["userId"])

    await queryInterface.addIndex("FriendNicknames", ["userId"])
    await queryInterface.addIndex("FriendNicknames", ["friendId"])

    await queryInterface.addIndex("Friends", ["userId"])
    await queryInterface.addIndex("Friends", ["friendId"])

    await queryInterface.addIndex("Insights", ["userId"])
    await queryInterface.addIndex("Insights", ["type"])

    await queryInterface.addIndex("Integrations", ["userId"])
    await queryInterface.addIndex("Integrations", ["type"])

    await queryInterface.addIndex("Messages", ["chatId"])
    await queryInterface.addIndex("Messages", ["userId"])

    await queryInterface.addIndex("Notes", ["workspaceFolderId"])
    await queryInterface.addIndex("Notes", ["shareLink"])

    await queryInterface.addIndex("Plans", ["internalName"])

    await queryInterface.addIndex("Reports", ["reportedByUserId"])
    await queryInterface.addIndex("Reports", ["reportedUserId"])
    await queryInterface.addIndex("Reports", ["email"])

    await queryInterface.addIndex("Slideshows", ["shareLink"])
    await queryInterface.addIndex("Slideshows", ["userId"])

    await queryInterface.addIndex("WorkspaceFolders", ["workspaceId"])
    await queryInterface.addIndex("WorkspaceFolders", ["folderId"])

    await queryInterface.addIndex("Workspaces", ["userId"])
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
