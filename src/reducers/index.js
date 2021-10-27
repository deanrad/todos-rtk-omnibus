import { combineReducers } from 'redux'
import todosReducer from 'features/todos/todosSlice'
import visibilityFilterReducer from 'features/filters/filtersSlice'
import { saveTodoService } from 'services/saveTodo'

export default combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer,
  [saveTodoService.reducerPath]: saveTodoService.reducer
})
