


/*export function getMaxTemp(data, callback) {
  let maxValue = 0
  for (let i=0; i<data.length;i++) {
    if (data[i].temp > maxValue)
      maxValue = data[i].temp
  }
  callback(maxValue)
}*/



function getMaxTemp(temp, callback) {
  let maxValue = 0
  for (i in data) {
    if (data[i].temp > maxValue)
      maxValue = data[i].temp
  }
  callback(maxValue)
}

function getMinTemp(temp, callback) {
  let minValue = Infinity
  for (i in data) {
    if (data[i].temp < minValue)
      minValue = data[i].temp
  }
  callback(minValue)
}

function getMaxPress(press, callback) {
  let maxValue = 0
  for (i in data) {
    if (data[i].press > maxValue)
      maxValue = data[i].press
  }
  callback(maxValue)
}

function getMinPress(press, callback) {
  let minValue = Infinity
  for (i in data) {
    if (data[i].press < minValue)
      minValue = data[i].press
    callback(minValue)
  }
}

function getMaxAlt(h, callback) {
  let maxValue = 0
  for (i in data) {
    if (data[i].h > maxValue)
      maxValue = data[i].h
  }
  callback(maxValue)
}

function getMinAlt(h, callback) {
  let minValue = Infinity
  for (i in data) {
    if (data[i].h < minValue)
      minValue = data[i].h
    callback(minValue)
  }
}
