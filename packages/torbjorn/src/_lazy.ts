interface Action {
  name: string;
  up: (...args: any[]) => any;
}

const actions: {[namespace: string]: Action[]} = {}

export function lazy<T extends((...args: any[]) => any)>(namespace: string, up: T): Action {
  const action = {
    name: up.name,
    up
  }

  if (!actions[namespace]) {
    actions[namespace] = []
  }

  actions[namespace].push(action)
  return action
}
