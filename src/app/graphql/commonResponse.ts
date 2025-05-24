export enum EStatus {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface CommonResponse<T = undefined> {
  status: EStatus;
  message: string;
  data?: T;
}