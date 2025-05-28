export enum EStatus {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface CommonResponse<T> {
  status: EStatus;
  message: string;
  data?: T;
}