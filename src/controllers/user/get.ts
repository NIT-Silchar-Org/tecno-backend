import * as Interfaces from "@interfaces";
import * as Success from "@success";

import { User } from "@prisma/client";
import { prisma } from "@utils/prisma";

const getAllUsers: Interfaces.Controller.Async = async (_req, res) => {
  const users: User[] = await prisma.user.findMany();

  res.json(Success.User.getAllUsersResponse(users));
};

export { getAllUsers };
