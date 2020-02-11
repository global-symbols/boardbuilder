export interface ObzBoards {
  [propName: string]: string;
}

export interface Obz {
  format: string;
  root: string;
  paths: ObzBoards;
  images: object;
  sounds: object;
}
