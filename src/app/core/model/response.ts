import { ErrorMessage } from 'src/app/models';

export interface Response {
  serverTime: string;
  responseCode: string;
  responseMessage: string;
  errorMessage?: ErrorMessage;
}

export interface Pagination {
  total: number;
  pageSize: number;
  currentPage: number;
  totalPage: number;
  from: number;
  to: number;
}

export interface Pagination {
  total: number;
  pageSize: number;
  currentPage: number;
  totalPage: number;
  from: number;
  to: number;
}
