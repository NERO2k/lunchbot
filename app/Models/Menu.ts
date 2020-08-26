import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Menu extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public raw: string

  @column()
  public parsed: string

  @column()
  public week: number

  @column()
  public year: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
