function breakdown(num) {
  let strNum = String(num)
  let result = []

  function nominal(initial, range) {
    let str = initial
    for (let j = 0; j < range; j++) {
      str += '0'
    }
    result.push(Number(str))
  }

  for (let i = 0; i < strNum.length; i++) {
    nominal(strNum[i], (strNum.length - 1) - i)
  }

  return result
}

console.log(breakdown(5623847))