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

    await this.transaction.runBatch(this.userId, async (scope) => {
      let habitlist: Habitlist | null

      habitlist = await this.habitlistRepository.get(scope)

      if (!habitlist) {
        const data = { userId: this.userId } as Habitlist

        habitlist = await new HabitlistBehavior(data).actionAsync(async behavior => {
          const created = await this.habitlistRepository.save(scope, behavior.format())
          behavior.update(created)
        })
      }

      const tmp: Habit[] = await this.habitRepository.get(scope, habitlist.id)

      tmp.forEach(async h => {
        const habit = await new HabitBehavior(h).actionAsync(async behavior => {
          const habitBehavior = (behavior as HabitBehavior)
          const data = habitBehavior.updateData()
          if (data.needServerUpdate) {
            const updated = await this.habitRepository.update(scope, habitlist!.id, data)
            habitBehavior.update(updated)
          }
        })
        results.push(habit)
      })
    })

    return results
  }

  /**
   * キャッシュから値を取得
   * @returns
   */
  public async getFromCache(): Promise<Habit[]> {
    const habitlistId = this.habitlistRepository.getId()
    const tmp: Habit[] = await this.habitRepository.getFromCache(this.userId, habitlistId)
    // actionで再計算を行う
    return tmp.map(h => new HabitBehavior(h).action(() => { }))
  }

  /**
   * 習慣の追加
   * @param habit
   * @returns
   */
  public async addHabit(habit: Partial<Habit>): Promise<Habit> {
    let result: Habit

    await this.transaction.run(this.userId, async (scope) => {

      const habitlistId = this.habitlistRepository.getId()

      if (!await this.habitRepository.validateMaxSize(scope, habitlistId)) {
        throw new Error('これ以上登録できません')
      }

      result = await new HabitBehavior(habit as Habit).actionAsync(async behavior => {
        behavior.update({ rootId: habitlistId, userId: this.userId })
        const created = await this.habitRepository.save(scope, habitlistId, behavior.format())
        behavior.update(created)
      })
    })

    return result!
  }

  /**
   * 習慣の更新
   * @param updateProps
   * @returns
   */
  public async updateHabit(updateProps: Partial<Habit>): Promise<Habit> {
    let result: Habit
    await this.transaction.run(this.userId, async (scope) => {
      result = await new HabitBehavior(updateProps as Habit).actionAsync(async behavior => {
        const habitlist = await this.habitlistRepository.get(scope)
        const updated = await this.habitRepository.update(scope, habitlist!.id, behavior.format())
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
    await this.transaction.run(this.userId, async (scope) => {
      const habitlist = await this.habitlistRepository.get(scope)
      this.habitRepository.delete(scope, habitlist!.id, habitId)
    })
  }

}