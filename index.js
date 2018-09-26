

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

// App code
function todos(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([ action.todo ])
  }

  return state;
}

const store = createStore(todos);

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 0, 
    name: 'Lear Redux',
    complete: false,
  }
})


const unsubscribe = store.subscribe(() => {
  console.log('The store changed. ')
})

// unsubscribe(); // Do not unsubscribe yet

