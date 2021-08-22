/*
 * @Description: 
 * @Author: Moriaty
 * @Date: 2020-10-23 14:36:53
 * @Last modified by: Moriaty
 * @LastEditTime: 2021-08-22 21:58:48
 */
/**
 *
 *  IP中四段要么是数字要么是*，并且*一定要在数字后面，以下是合法输入范例：
 *  192.*.*.*
 * 192.168.*.*
 * 192.168.1.*
 * 192.168.1.10
 * 192.*.*.*
 * 192.168.*.*
 * 192.168.1.*
 * 192.168.1.10
 */

/**
 *   @param {String} text
 *   @return {Boolean}
 * 
 **/
function checkIfInputValid(text) {
  const arr = text.split('.')
  if ( arr.length < 4) return false

  if (arr.some((item, index) => {
    if (item === '*'&& index < arr.length - 1 && !arr.slice(index + 1).some(item => item === '*')) {
      return true
    }
    const itemNum = Number(item)
    if (itemNum > 255  || (item !== '*' && itemNum.toString() !== item)) return true
    return false
  })) {
    return false
  }


  return true
}

console.assert(!checkIfInputValid('1.1.*'), "you're valid");
console.assert(checkIfInputValid('1.1.1.*'), "you're valid");
console.assert(!checkIfInputValid('269.1.1.*'), "269 exceed range");
console.assert(!checkIfInputValid('192.*.2.1'), 'asterisk can\'t occur before number');
console.assert(!checkIfInputValid('19a.2.001.1'), 'alphabet can\'t occur');
console.assert(!checkIfInputValid('19.2.0001.1'), 'segment can\'t be 0000');