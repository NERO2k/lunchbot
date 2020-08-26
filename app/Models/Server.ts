import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Server extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public enabled: boolean

  @column()
  public server_id: string

  @column()
  public channel_id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
