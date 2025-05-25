export enum EStatus {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface CommonResponse<T = any> {
  status: EStatus;
  message: string;
  data?: T;
}