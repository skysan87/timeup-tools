/**
 * @param {string} value
 * @returns {boolean}
 */
export function isEmpty (value?: string | null): boolean {
  return (value ?? '') === ''
}