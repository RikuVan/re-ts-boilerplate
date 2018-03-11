export interface Action<T extends string> {
  type: T
}
export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P
}

export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(
  type: T,
  payload: P
): ActionWithPayload<T, P>
export function createAction<T extends string, P>(type: T, payload?: P) {
  return payload !== undefined ? { type, payload } : { type }
}

// tslint:disable-next-line:no-any
export const getReturnType = <R>(f: (...args: any[]) => R): R => null!
