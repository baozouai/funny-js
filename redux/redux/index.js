/*
 * @Description: 
 * @Author: Moriaty
 * @Date: 2020-09-29 15:47:08
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-29 15:56:49
 */
const allReducer = require('./reducer');
const {
  reducer
} = allReducer;
const createStore = require('./store').default;

const store = createStore(reducer);

store.subscribe(state => console.log(state));
store.subscribe(state => console.log(state));

store.dispatch({
  type: 'ADD'
});
store.dispatch({
  type: 'ADD'
});
store.dispatch({
  type: 'ADD'
});