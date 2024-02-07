/**
 * @param {string} value
 * @returns {boolean}
 */
export function isEmpty (value: string): boolean {
  return (value ?? '') === ''
}