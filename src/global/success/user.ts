import { User } from "@prisma/client";
import * as Utils from "@utils";

const userCreated = Utils.Response.Success("user Created");

const getAllUsersResponse = (users: User[]) => {
  return Utils.Response.Success<User[]>(users);
};

const getOneUserResponse = (user: User) => {
  return Utils.Response.Success<User>(user);
};

export { userCreated, getAllUsersResponse, getOneUserResponse };
