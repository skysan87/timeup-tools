import { HabitBehavior } from "@/Domain/Behavior/HabitBehavior"
import { HabitlistBehavior } from "@/Domain/Behavior/HabitlistBehavior"
import { Habit, Habitlist } from "@/Domain/Model"
import { IHabitRepository, IHabitlistRepository, ITransaction, IUserRepository } from "@/Domain/Repository"
import { UserId } from "@/Domain/ValueObject"

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

  /**
   * リストの取得
   * @description 存在しない場合は新規作成する
   * @returns
   */
  public async getList(): Promise<Habitlist> {
    let result: Habitlist

    await this.transaction.run(async () => {
      const habitlist = await this.habitlistRepository.get(this.userId)

      if (habitlist) {
        result = habitlist
        return
      }

      const data = {
        userId: this.userId
      } as Habitlist

      result = await new HabitlistBehavior(data).actionAsync(async behavior => {
        const created = await this.habitlistRepository.save(this.userId, behavior.format())
        behavior.update(created)
      })
    })

    return result!
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
      const created = await this.habitRepository.save(this.userId, behavior.format())
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
        const updated = await this.habitRepository.update(this.userId, updateProps)
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
      this.habitRepository.delete(this.userId, habitId)
    })
  }

}