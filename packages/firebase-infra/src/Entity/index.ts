import { Config, Habit, Habitlist, Task, Tasklist } from "@timeup-tools/core/model"
import { FieldValue } from "firebase/firestore"

type FirebaseField = {
  createdAt: FieldValue
  updatedAt: FieldValue
}

/**
 * Firebaseのプロパティに上書きする
 */
type Entity<T> = Omit<
  T,
  keyof FirebaseField | 'id' // Tにある同一プロパティを削除
> & FirebaseField     // 削除したプロパティを上書き

export type TaskEntity = Entity<Task>

export type TasklistEntitu = Entity<Tasklist>

export type HabitEntity = Entity<Habit>

export type HabitlistEntity = Entity<Habitlist>

export type ConfigEntity = Entity<Config>