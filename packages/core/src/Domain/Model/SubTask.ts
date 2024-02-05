import { Nominal } from "../ValueObject";

export type SubTask = Nominal<{
  id: string
  title: string
  isDone: boolean
}, 'SubTask'>