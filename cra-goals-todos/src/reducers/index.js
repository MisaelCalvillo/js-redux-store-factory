import { combinedReducers } from 'redux'

import todos from './todos'
import loading from './loading'
import goals from './goals'

export default combinedReducers({
  todos,
  loading,
  goals
})