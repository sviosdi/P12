export const getRange = (data, prop) => {
    let max = data[0][prop]
    let min = max
    data.forEach((e) => {
        max = e[prop] > max ? e[prop] : max
        min = e[prop] < min ? e[prop] : min
    })
    return { max: max, min: min }
}
