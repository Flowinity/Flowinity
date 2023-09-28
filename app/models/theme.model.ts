import { Column, DataType, Default, Model, Table } from "sequelize-typescript"
import { Field, ObjectType } from "type-graphql"

@ObjectType()
@Table
export class Theme extends Model {
  @Field()
  @Column
  name: string

  @Field()
  @Column
  userId: number

  @Field()
  @Column
  public: boolean

  @Default({
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
      nav: "#FFFFFF"
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
      nav: "#FFFFFF"
    }
  })
  @Column({
    type: DataType.JSON
  })
  theme: ThemeObject
}
