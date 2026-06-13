export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  phoneNumber: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserResponse {
  status: string;
  data: {
    user: IUser;
  };
}