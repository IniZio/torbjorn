import {OperationsFunction} from '../types'

export function noop(e): void {console.error(e)}

/**
 * Run multiple operations in parallel
 *
 * @export
 * @param {(v: any) => Promise<any>} callback
 * @returns {(s: any) => Promise<any>}
 */
export function parallel<T, TU>(callback: (v: T) => Promise<TU>): OperationsFunction<T, TU> {
  return ((operations: T | T[]) => Array.isArray(operations) ? Promise.all([].concat(operations).map(callback)) : callback(operations)) as OperationsFunction<T, TU>
}

export async function serial<T extends ((...args: any[]) => any)>(tasks: T[]): Promise<T[]> {
  const results = []

  for (const task of tasks) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await task())
  }

  return results
}
