import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class Weather {
  @Field({
    nullable: true
  })
  icon: string
  @Field({
    nullable: true
  })
  temp: number
  @Field({
    nullable: true
  })
  feels_like: number
  @Field({
    nullable: true
  })
  temp_min: number
  @Field({
    nullable: true
  })
  temp_max: number
  @Field({
    nullable: true
  })
  pressure: number
  @Field({
    nullable: true
  })
  humidity: number
  @Field({
    nullable: true
  })
  wind_speed: number
  @Field({
    nullable: true
  })
  wind_deg: number
  @Field({
    nullable: true
  })
  clouds: number
  @Field({
    nullable: true
  })
  visibility: number
  @Field({
    nullable: true
  })
  error: boolean
  @Field({
    nullable: true
  })
  cached: boolean
  @Field({
    nullable: true
  })
  description: string
  @Field({
    nullable: true
  })
  main: string
  @Field({
    nullable: true
  })
  location: string
  @Field({
    nullable: true
  })
  wind_gust: number
  @Field({
    nullable: true
  })
  sunrise: number
  @Field({
    nullable: true
  })
  sunset: number
  @Field({
    nullable: true
  })
  rain_1h: number
  @Field({
    nullable: true
  })
  rain_3h: number
}
