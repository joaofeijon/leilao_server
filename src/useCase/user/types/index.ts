export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface IResponseCreateUser {
  result: boolean;
  message: string;
}