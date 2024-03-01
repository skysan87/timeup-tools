import { TaskState } from "@timeup-tools/core/value-object"

export const useStateColor = () => {
  return {
    getStateColor: (state?: TaskState) => {
      console.log('getStateColor', state)
      switch (state) {
        case TaskState.Todo:
          return 'circle-button-todo'
        case TaskState.InProgress:
          return 'circle-button-inprogress'
        case TaskState.Done:
          return 'circle-button-done'
        default:
          return 'circle-button-default'
      }
    }
  }
}