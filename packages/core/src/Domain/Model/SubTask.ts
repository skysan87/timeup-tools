import { Nominal } from "../ValueObject";

export type SubTask = Nominal<{
  id: string // TODO: nominal
  title: string
  isDone: boolean
}, 'SubTask'>