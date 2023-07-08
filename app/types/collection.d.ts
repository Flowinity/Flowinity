import {Collection} from "@app/models/collection.model"

type CollectionCache = Collection & {
    permissionsMetadata: {
        write: boolean
        read: boolean
        configure: boolean
    }
    shared: boolean
}

type AutoCollectCache = Collection & {
    permissionsMetadata: {
        write: boolean
        read: boolean
        configure: boolean
    }
    autoCollectApprovals: []
}
