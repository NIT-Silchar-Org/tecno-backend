import { User, Prisma } from "@prisma/client";
import { prisma } from "./prisma";

const extractUsername = async (
  users: User[]
): Promise<Prisma.UserWhereUniqueInput[] | undefined> => {
  if (!users) return undefined;
  const usernames = [];
  for (let i = 0; i < users.length; i++) {
    const username = users[i].username;
    if (typeof username !== "string") return undefined;
    if (!(await prisma.user.findFirst({ where: { username } })))
      return undefined;
    usernames.push({ username });
  }

  return usernames;
};

export { extractUsername };
