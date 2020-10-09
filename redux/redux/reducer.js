const initState = {
  count: 1,
};

function reducer(state = initState, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        count: state.count + 1,
      }
    case 'SUBSTRACT':
      return {
        ...state,
        count: state.count - 1,
      }
    default:
      return initState;
  }
}
module.exports = {
  reducer,
};