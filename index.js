

// Library code
function createStore(reducer) {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

// Action variables instead of just string, because strings are prone to lots of errors
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

// Action creators

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  }
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  }
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id
  }
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  }
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  }
}

// App code
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([ action.todo ])
    case REMOVE_TODO:
      return state.filter( (todo) => todo.id !== action.id)
    case TOGGLE_TODO: 
      return state.map( (todo) => todo.id !== action.id ? todo :
      Object.assign({}, todo, { complete: !todo.complete}))
    default: 
      return state
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL: 
      return state.concat([ action.goal ])
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id)
    default:
      return state
  }
}

function app(state = {}, action){
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  }
}

const store = createStore(app);

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})


store.dispatch(addTodoAction({
  id: 0,
  name: 'Walk the dog',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 1,
  name: 'Wash the car',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 2,
  name: 'Go to the gym',
  complete: true,
}))

store.dispatch(removeTodoAction(1))

store.dispatch(toggleTodoAction(0))

store.dispatch(addGoalAction({
  id: 0,
  name: 'Learn Redux'
}))

store.dispatch(addGoalAction({
  id: 1,
  name: 'Lose 20 pounds'
}))

store.dispatch(removeGoalAction(0))

// const unsubscribe = store.subscribe(() => {
//   console.log('The store changed. ')
// })

// unsubscribe(); // Do not unsubscribe yet
  
// store.dispatch({
//   type: ADD_TODO,
//   todo: {
//     id: 3, 
//     name: 'Lear Redux',
//     complete: false,
//   }
// })

// Transforms into this

// store.dispatch(addTodoAction({
//   id: 0, 
//   name: 'Lear Redux',
//   complete: false,
// }))
