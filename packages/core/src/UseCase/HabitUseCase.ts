import { HabitBehavior } from "../Domain/Behavior/HabitBehavior"
import { HabitlistBehavior } from "../Domain/Behavior/HabitlistBehavior"
import { Habit, Habitlist } from "../Domain/Model"
import { IHabitRepository, IHabitlistRepository, ITransaction, IUserRepository } from "../Domain/Repository"
import { UserId } from "../Domain/ValueObject"

export class HabitUseCase {

  constructor(
    private readonly userRepositpry: IUserRepository,
    private readonly habitlistRepository: IHabitlistRepository,
    private readonly habitRepository: IHabitRepository,
    private readonly transaction: ITransaction
  ) { }

  private _userId: UserId | null = null

  private get userId(): UserId {
    return this._userId ?? this.userRepositpry.getFromCache().id
  }

  public create(): Habit {
    return new HabitBehavior({} as Habit).format()
  }

  public async init(): Promise<Habit[]> {
    const results: Habit[] = []

    await this.transaction.run(async () => {
      let habitlist: Habitlist | null

      habitlist = await this.habitlistRepository.get(this.userId)

      if (!habitlist) {
        const data = { userId: this.userId } as Habitlist

        habitlist = await new HabitlistBehavior(data).actionAsync(async behavior => {
          const created = await this.habitlistRepository.save(this.userId, behavior.format())
          behavior.update(created)
        })
      }

      const tmp: Habit[] = await this.habitRepository.get(this.userId, habitlist.id)

      tmp.forEach(async h => {
        const habit = await new HabitBehavior(h).actionAsync(async behavior => {
          const habitBehavior = (behavior as HabitBehavior)
          const data = habitBehavior.updateData()
          if (data.needServerUpdate) {
            const updated = await this.habitRepository.update(this.userId, habitlist!.id, data)
            habitBehavior.update(updated)
          }
        })
        results.push(habit)
      })
    })

    return results
  }

  /**
   * 習慣の追加
   * @param habit
   * @returns
   */
  public async addHabit(habit: Partial<Habit>): Promise<Habit> {
    if (!this.habitRepository.validateMaxSize()) {
      throw new Error('これ以上登録できません')
    }

    return new HabitBehavior(habit as Habit).actionAsync(async behavior => {
      const habitlist = await this.habitlistRepository.get(this.userId)
      const created = await this.habitRepository.save(this.userId, habitlist!.id, behavior.format())
      behavior.update(created)
    })
  }

  /**
   * 習慣の更新
   * @param updateProps
   * @returns
   */
  public async updateHabit(updateProps: Partial<Habit>): Promise<Habit> {
    let result: Habit
    await this.transaction.run(async () => {
      result = await new HabitBehavior(updateProps as Habit).actionAsync(async behavior => {
        const habitlist = await this.habitlistRepository.get(this.userId)
        const updated = await this.habitRepository.update(this.userId, habitlist!.id, behavior.format())
        behavior.update(updated)
      })
    })
    return result!
  }

  /**
   * 習慣の削除
   * @param habitId
   */
  public async deleteHabit(habitId: string): Promise<void> {
    await this.transaction.run(async () => {
      const habitlist = await this.habitlistRepository.get(this.userId)
      this.habitRepository.delete(this.userId, habitlist!.id, habitId)
    })
  }

}