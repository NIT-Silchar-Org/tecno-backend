import { User } from "@prisma/client";
import * as Interfaces from "@interfaces";
import * as Utils from "@utils";

const userCreated = Utils.Response.Success("User Created");

const getAllUsersResponse = (users: User[]) => {
  return Utils.Response.Success<User[]>(users);
};
const getMyTeamsResponse = (
  teamRegistrations: Interfaces.User.getMyTeamsResponseTeamRegistration[]
) => {
  return Utils.Response.Success<
    Interfaces.User.getMyTeamsResponseTeamRegistration[]
  >(teamRegistrations);
};

const getOneUserResponse = (user: User) => {
  return Utils.Response.Success<User>(user);
};
const updateUserResponse = (user: User) => {
  return Utils.Response.Success<User>(user);
};

export {
  userCreated,
  getAllUsersResponse,
  getOneUserResponse,
  updateUserResponse,
  getMyTeamsResponse,
};
