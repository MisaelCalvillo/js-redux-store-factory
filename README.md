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



