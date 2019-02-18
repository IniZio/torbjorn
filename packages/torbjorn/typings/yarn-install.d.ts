interface YarnOptions {
  deps?: string[];
  cwd?: string;
  registry?: string;
  dev?: boolean;
  global?: boolean;
  remove?: boolean;
  production?: boolean;
  respectNpm5?: boolean;
}

declare module 'yarn-install' {
  const yarnInstall: (options: YarnOptions) => Promise<void>
  export = yarnInstall
}
