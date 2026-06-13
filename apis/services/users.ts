import { urls } from "../urls";
import axiosInstance from "../client";
import { IUser, IUserResponse } from "@/types/user";

type getUserType = (params: IReqGetById) => Promise<IUserResponse>;

export const getUser: getUserType = async ({ id }) => {
  const response = await axiosInstance.get(`${urls.Users.byId(+id)}`);
  console.log(response);
  return response.data;
};
