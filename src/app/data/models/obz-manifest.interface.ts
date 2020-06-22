export interface ObzBoards {
  [propName: string]: string;
}

export interface ObzPaths {
  boards: ObzBoards;
  images: ObzBoards;
  sounds: ObzBoards;
}

export interface ObzManifest {
  format: string;
  root: string;
  paths: ObzPaths;
}
