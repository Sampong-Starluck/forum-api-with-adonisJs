import { DateTime } from "luxon";
import { BaseModel, belongsTo, column, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Forum from "./Forum";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public content: string;

  @column()
  public forumId: number;

  @column()
  public userId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  //Relationship
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @belongsTo(() => Forum)
  public forum: BelongsTo<typeof Forum>;
}
