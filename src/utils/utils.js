/**
 * @typedef {Object} Range
 * @property {number} min - The smallest value of the field
 * @property {number} max - The largest value of the field
 */

/**
 * Returns the maximum and minimum of a `prop` property from a `data` array of objects having the `prop` property
 * @function getRange
 * @param {array} data The array of objects
 * @param {string} prop The property for which we seek the minimum and the maximum
 * @return {Range} An object whose fields are the minimum and maximum of the prpperty
 */
export const getRange = (data, prop) => {
    let max = data[0][prop]
    let min = max
    data.forEach((e) => {
        max = e[prop] > max ? e[prop] : max
        min = e[prop] < min ? e[prop] : min
    })
    return { min: min, max: max }
}
