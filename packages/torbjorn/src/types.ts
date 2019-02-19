import Torbjorn from './instance'

export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Callback function that can accept single or array of operations
 *
 * @interface OperationsFunction
 * @template T Received parameter
 * @template TU Return type
 */
export interface OperationsFunction<T, TU> {
  (v: T): Promise<TU>;
  (v: T[]): Promise<TU[]>;
}

/**
 * Config loader
 *
 * @interface Loader
 */
export interface Loader {
  test?: string | RegExp;
  load?(path: string): any;
  parse?(content: any): any;
  write?(data: any): any;
}

/**
 * Description for features
 *
 * @interface Description
 */
export interface Description {
  configFiles?: string[];
  loaders?: {[index: string]: Loader};
}

export interface Installer {
  (deps: string | string[], options?: YarnOptions): void;
  now(deps: string | string[], options?: YarnOptions): Promise<void>;
}

export interface Action {
  name: string;
  description?: string;
  call: ((self: Torbjorn, ...args: any) => any) | Config[];
}

export interface IncludeOptions {
  only?: string[];
  except?: string[];
}

export type Config = ['action', Action] | ['include', string, IncludeOptions] | [string, ...any[]]

// interface TorbjornOptions {}

export interface YarnOptions {
  deps?: string[];
  cwd?: string;
  registry?: string;
  dev?: boolean;
  global?: boolean;
  remove?: boolean;
  production?: boolean;
  respectNpm5?: boolean;
}
