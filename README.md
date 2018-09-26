# Vanilla Javascript Redux Store Factory

This repo is intended to make a Redux Store Factory just with plain vanilla Javascript.

### Create a Store

The first step is to create a Factory that encapsulates the state and a way to get it. 

```javascript

function createStore() {

  let state

  const getState = () => state

  return {
    getState
  }
}

const store = createStore();

```

### Listen for changes

We also need a good way to know if there have been changes on our store.

```javascript

function createStore() {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  return {
    getState,
    subscribe
  }
}

const store = createStore();

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

const unsubscribe = store.subscribe(() => {
  console.log('The store changed. ')
})

unsubscribe();


```

### The reducer function

Add a new reducer to be used in the store.

```javascript

function todos(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([ action.todo ])
  }

  return state;
}


function createStore() {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  return {
    getState,
    subscribe
  }
}

const store = createStore();

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

const unsubscribe = store.subscribe(() => {
  console.log('The store changed. ')
})

unsubscribe();


```

### Add a dispatch method

Add a way to run all the listeners in the store.

```javascript
function todos(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([ action.todo ])
  }

  return state;
}


function createStore() {

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
    subscribe
  }
}

const store = createStore();

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

const unsubscribe = store.subscribe(() => {
  console.log('The store changed. ')
})

unsubscribe();

```

### Put it all together

You now at this point can play in the console with this code !!! 👩🏽‍💻 👨🏽‍💻 

```javascript


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

```

### Add 'REMOVE_TODO' and 'TOGGLE_TODO' actions

```javascript
// App code
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([ action.todo ])
    case 'REMOVE_TODO':
      return state.filter( (todo) => todo.id !== action.id)
    case 'TOGGLE_TODO': 
      return state.map( (todo) => todo.id !== action.id ? todo :
      Object.assign({}, todo, { complete: !todo.complete}))
    default: 
      return state
  }
}
```

### Add another reducer

We now can track our goals as well as our todos, but our store doesn't have a mean to accept two reducers, we will see that in the next section... ⏭

```javascript
function goals(state = [], action) {
  switch (action.type) {
    case 'ADD_GOAL': 
      return state.concat([ action.goal ])
    case 'REMOVE_GOAL':
      return state.filter((goal) => goal.id !== action.id)
    default:
      return state
  }
}
```

### Add a 'root reducer' to combine several reducers

With this reducer called `app` we can now combine many reducers in our store.

```javascript
function app(state = {}, action){
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  }
}

const store = createStore(app);

```



