import {BelongsTo, Column, HasMany, Model, Table} from "sequelize-typescript"

// Import Models
import {Workspace} from "@app/models/workspace.model"
import {Note} from "@app/models/note.model"

@Table
export class WorkspaceFolder extends Model {
    @Column
    name: string

    @Column
    workspaceId: number

    @Column
    folderId: number

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace

    @BelongsTo(() => WorkspaceFolder, "folderId")
    folder: WorkspaceFolder

    @HasMany(() => Note, "workspaceFolderId")
    notes: Note[]

    @HasMany(() => Note, "workspaceFolderId")
    children: Note[]
}
