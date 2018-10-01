import API from 'goals-todos-api'

onst RECIEVE_DATA = 'RECIEVE_DATA'

function receiveData (todos, goals) {
  return {
    type: RECIEVE_DATA,
    todos,
    goals,
  }
}

export function handleInitialData() {
  return (dispatch) => {
   return Promise.all([
      API.fetchTodos(),
      API.fetchGoals()
    ]).then(([ todos, goals ]) => {
      dispatch(receiveData(todos, goals))
    })
  }
}
