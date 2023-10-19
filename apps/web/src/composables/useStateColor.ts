import { TaskState } from "@timeup-tools/core/value-object"

export const useStateColor = () => {
  return {
    getStateColor: (state?: TaskState) => {
      switch (state) {
        case TaskState.Todo:
          return {
            color: '#212529',
            backgroundColor: '#fff',
            border: '1px solid #000000'
          }
        case TaskState.InProgress:
          return {
            color: '#212529',
            backgroundColor: '#ffc107'
          }
        case TaskState.Done:
          return {
            color: '#fff',
            backgroundColor: '#28a745'
          }
        default:
          return {
            color: '#fff',
            backgroundColor: '#17a2b8'
          }
      }
    }
  }
}