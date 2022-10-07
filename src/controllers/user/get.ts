import * as Interfaces from "@interfaces";
import * as Success from "@success";

import { User } from "@prisma/client";
import { prisma } from "@utils/prisma";

const getAllUsers: Interfaces.Controller.Async = async (_req, res) => {
  const users: User[] = await prisma.user.findMany();

  res.json(Success.User.getAllUsersResponse(users));
};

const searchUsers: Interfaces.Controller.Async = async (req, res) => {
  const { q } = req.query;
  const query_string = q;

  // TODO: Include array in the query string
  
  const result = await prisma.user.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: query_string,
          },
        },
        { lastName: { contains: query_string } },
        {
          username: {
            contains: query_string,
          },
        }
      ]
    },
    select: {
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      imageUrl: true,
    },
  })

  res.json(Success.User.getAllUsersResponse(result));
  
};

export { getAllUsers, searchUsers };
