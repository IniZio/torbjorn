import Torbjorn from './instance'

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
  write?(data: any): string;
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

export type Config = ['action', Action] | [string, ...any[]]

export interface FsOperations {
  exists: OperationsFunction<{
      path: string;
  }, boolean>;
  write: OperationsFunction<{
      file: string;
      data: any;
  }, void>;
  read: OperationsFunction<{
      file: string | number | Buffer;
  }, string>;
  copy: OperationsFunction<{
      src: string;
      dest: string;
  }, void>;
  remove: OperationsFunction<{
      path: string;
  }, void>;
  move: OperationsFunction<{
      src: string;
      dest: string;
      opt?: any;
  }, void>;
  mkdir: OperationsFunction<{
      path: string;
  }, void>;
  emptydir: OperationsFunction<{
      path: string;
  }, void>;
  ejs: OperationsFunction<{
      src: string;
      dest: string;
      context: any;
      tplOptions?: any;
      options?: any;
      opt?: any;
  }, {}>;
}

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
