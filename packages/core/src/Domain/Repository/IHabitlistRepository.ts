import { Habitlist } from "../Model/Habitlist"
import { UserId } from "../ValueObject"

export interface IHabitlistRepository {
  get(userId: UserId): Promise<Habitlist[] | null>
  save(userId: UserId, data: Partial<Habitlist>): Promise<void>
  update(userId: UserId, data: Partial<Habitlist>): Promise<void>
}