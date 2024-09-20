import { Field, Float, ObjectType } from "type-graphql"

@ObjectType()
export class Weather {
  @Field({
    nullable: true
  })
  icon: string
  @Field(() => Float, {
    nullable: true
  })
  temp: number
  @Field(() => Float, {
    nullable: true
  })
  feels_like: number
  @Field(() => Float, {
    nullable: true
  })
  temp_min: number
  @Field(() => Float, {
    nullable: true
  })
  temp_max: number
  @Field(() => Float, {
    nullable: true
  })
  pressure: number
  @Field(() => Float, {
    nullable: true
  })
  humidity: number
  @Field(() => Float, {
    nullable: true
  })
  wind_speed: number
  @Field(() => Float, {
    nullable: true
  })
  wind_deg: number
  @Field(() => Float, {
    nullable: true
  })
  clouds: number
  @Field(() => Float, {
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
  @Field(() => Float, {
    nullable: true
  })
  wind_gust: number
  @Field(() => Float, {
    nullable: true
  })
  sunrise: number
  @Field(() => Float, {
    nullable: true
  })
  sunset: number
  @Field(() => Float, {
    nullable: true
  })
  rain_1h: number
  @Field(() => Float, {
    nullable: true
  })
  rain_3h: number
}
