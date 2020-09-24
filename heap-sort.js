/*
 * @Description: 
 * @Author: Moriaty
 * @Date: 2020-09-16 13:06:54
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-16 20:51:04
 */
function buildMaxHeap(arr) {
  const len = arr.length;
  for (let i = Math.floor(len / 2); i >= 0; --i) {
    debugger
    heapify(arr, i);
  }
};

function heapify(arr, i, len = arr.length) {
  debugger
  let left = 2 * i + 1;
  let right = left + 1;
  let largestIndex = i;
  if (left < len && arr[left] > arr[largestIndex]) {
    largestIndex = left;
  }
  if (right < len && arr[right] > arr[largestIndex]) {
    largestIndex = right;
  }
  if (largestIndex !== i) {
    [arr[i], arr[largestIndex]] = [arr[largestIndex], arr[i]];
    if (2 * largestIndex + 1 < len) {
      heapify(arr, largestIndex, len);
    }
  }
}

function heapSort(arr) {
  buildMaxHeap(arr);
  for (let i = arr.length - 1; i > 0; --i) {
    debugger
      [arr[0], arr[i]] = [arr[i], arr[0]];
    if (i > 1) {
      heapify(arr, 0, i);
    }
  }
  return arr;
}
console.log(heapSort([2, 3, 5, 1, -5, 8, 9]));
//       -5
//   1       2
// 3   5  8    9