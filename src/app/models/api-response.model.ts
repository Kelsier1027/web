import { Pagination, Response } from '../core/model';

export interface AccountListRes<dataType> extends Response {
  result: {
    isAdminChangeApply: boolean;
    members: dataType;
    memberApplying: dataType;
  };
}

export interface ListRes<dataType> extends Response {
  result: {
    data: dataType[];
    pagination?: Pagination;
    minCreateDate: string;
  };
}

export interface DetailRes<dataType> extends Response {
  result: {
    model: dataType;
  };
}

export interface ResultRes<dataType> extends Response {
  result: dataType;
}
