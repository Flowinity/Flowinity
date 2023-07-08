import {v4 as uuidv4} from "uuid"

export class DefaultProfileLayout {
    constructor() {
        return {
            layout: {
                columns: [
                    {
                        rows: [
                            {
                                name: "profile-info",
                                id: uuidv4()
                            },
                            {
                                name: "divider",
                                id: uuidv4()
                            },
                            {
                                name: "mutual-collections",
                                id: uuidv4()
                            },
                            {
                                name: "divider",
                                id: uuidv4()
                            },
                            {
                                name: "mutual-friends",
                                id: uuidv4()
                            },
                            {
                                name: "divider",
                                id: uuidv4()
                            },
                            {
                                name: "core-statistics",
                                id: uuidv4(),
                                props: {
                                    friendsOnly: true
                                }
                            }
                        ]
                    }
                ]
            },
            config: {
                containerMargin: undefined,
                showStatsSidebar: true
            },
            version: 1
        }
    }
}
