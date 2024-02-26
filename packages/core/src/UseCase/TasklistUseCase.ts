import { UserId } from "../Domain/ValueObject"
import { ITaskRepository, ITasklistRepository, ITransaction, IUserRepository } from "../Domain/Repository"
import { Tasklist } from "../Domain/Model"
import { TasklistBehavior } from "../Domain/Behavior/TasklistBehavior"

export class TasklistUseCase {

  constructor(
    private readonly userRepositpry: IUserRepository,
    private readonly tasklistRepository: ITasklistRepository,
    private readonly taskRepository: ITaskRepository,
    private readonly transaction: ITransaction
  ) { }

  private _userId: UserId | null = null

  private static readonly DEFALT_TITLE: string = 'inbox'

  private get userId(): UserId {
    return this._userId ?? this.userRepositpry.getFromCache().id
  }

  public create(data?: Partial<Tasklist>): Tasklist {
    return new TasklistBehavior((data ?? {}) as Tasklist).format()
  }

  /**
   * リストの取得
   * @description 存在しない場合は新規作成する
   * @returns
   */
  public async getList(): Promise<Tasklist[]> {
    let result: Tasklist[] = []

    await this.transaction.run(this.userId, async (scope) => {
      const lists = await this.tasklistRepository.get(scope)

      if (lists.length > 0) {
        result.push(...lists)
        return
      }

      const data = {
        userId: this.userId,
        title: TasklistUseCase.DEFALT_TITLE
      } as Tasklist

      const newList = await new TasklistBehavior(data).actionAsync(async behavior => {
        const created = await this.tasklistRepository.save(scope, behavior.format())
        behavior.update(created)
      })
      result.push(newList)
    })

    return result
  }

  /**
   * 追加
   * @param tasklist
   * @returns
   */
  public async addList(tasklist: Partial<Tasklist>): Promise<Tasklist> {
    let _tasklist: Tasklist
    await this.transaction.run(this.userId, async (scope) => {

      if (!await this.tasklistRepository.validateMaxSize(scope)) {
        throw new Error('これ以上登録できません')
      }

      // TODO: firestoreの構造を変更時にmaxIndexを保持するようにする
      const maxIndex = await this.tasklistRepository.getMaxIndex(scope)

      _tasklist = await new TasklistBehavior(tasklist as Tasklist).actionAsync(async behavior => {
        behavior.update({ maxIndex: maxIndex + 1, userId: this.userId })
        const created = await this.tasklistRepository.save(scope, behavior.format())
        behavior.update(created)
      })
    })
    return _tasklist!
  }

  /**
   * 更新
   * @param updateProps
   * @returns
   */
  public async updateList(updateProps: Partial<Tasklist>) {
    let result: Tasklist
    await this.transaction.run(this.userId, async (scope) => {
      result = await new TasklistBehavior(updateProps as Tasklist).actionAsync(async behavior => {
        const updated = await this.tasklistRepository.update(scope, updateProps)
        behavior.update(updated)
      })
    })
    return result!
  }

  /**
   * 削除
   * @param tasklistId
   */
  public async deleteList(tasklistId: string): Promise<void> {
    await this.transaction.runBatch(this.userId, async (scope) => {
      const tasks = await this.taskRepository.get(scope, tasklistId)
      await this.tasklistRepository.delete(scope, tasklistId)
      await this.taskRepository.delete(scope, tasks.map(t => t.id))
    })
  }

}