export interface IAccessToken {
  access_token: string;
}

export type ReqStrategy = {
  body: {
    email: string;
    password: string;
  };
};

export interface IRequestUser {
  id: string;
  email: string;
  username: string;
  active: boolean;
}

export interface ITokenPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
  active: boolean;
}

export interface IPaginatedResult<T> {
  results: T[];
  pagination: {
    total: number | undefined;
    size: number;
    skip: number;
    take: number;
    hasMore?: boolean;
  };
}
export type IPaginationArgs<T> = T & {
  skip?: number;
  take?: number;
  includeCount?: boolean;
};
