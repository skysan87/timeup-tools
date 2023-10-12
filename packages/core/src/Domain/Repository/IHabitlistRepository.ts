import { Habitlist } from "../Model/Habitlist"
import { UserId } from "../ValueObject"

/**
 * ユーザ毎に1つのレコード
 */
export interface IHabitlistRepository {
  get(userId: UserId): Promise<Habitlist | null>
  save(userId: UserId, data: Partial<Habitlist>): Promise<Habitlist>
  update(userId: UserId, data: Partial<Habitlist>): Promise<Habitlist>
}