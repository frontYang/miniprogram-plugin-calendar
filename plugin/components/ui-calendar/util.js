/**
 * 一维数组转多维
 * @param {Array} 数组 array
 * @param {Number} 几维 n, 默认7
 */
const getMulArray = (array, n) => {
  let newArr = []
  n = n ? n : 7
  array.forEach(function (item, index) {
    let num = Math.floor(index / n)
    if (!newArr[num]) {
      newArr[num] = []
    }
    newArr[num].push(item)
  })

  return newArr
}

const formatNumber = (value) => {
  return (value < 10 ? '0' : '') + value;
}


module.exports = {
  getMulArray,
  formatNumber
}