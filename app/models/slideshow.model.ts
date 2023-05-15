import {Column, DataType, Default, Model, Table} from "sequelize-typescript"

@Table
export class Slideshow extends Model {
  @Column
  name: string

  @Column
  shareLink: string

  @Column
  userId: number

  @Default([])
  @Column({
    type: DataType.JSON
  })
  collectionIds: number[]

  @Column
  includeGallery: boolean

  @Default(5)
  @Column({
    type: DataType.FLOAT
  })
  speed: number

  @Column
  scaling: string

  @Column
  showCaptions: boolean
}
