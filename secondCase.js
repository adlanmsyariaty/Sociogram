function flattenArray(array) {
  let result = []
  function recursive(data) {
    if (Array.isArray(data)) {
      for (let j = 0; j < data.length; j++) {
        recursive(data[j])
      }
    } else {
      result.push(data)
    }
  }
  recursive(array)
  return result
}

console.log(flattenArray([1, 2, [3, 4, [5, 5, 7]], 5, [6, 7], 8]))

function flatArray(array) {
  let result = array.reduce((accum, item) => {
    Array.isArray(item)
    ? accum.push(...flattenArray(item))
    : accum.push(item)

    return accum
  }, [])

  return result
}

console.log(flatArray([1, 2, [3, 4, [5, 5, 7, [5, 7, 9]]], 5, [6, 7], 8]))