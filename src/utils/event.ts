import { User, Prisma } from "@prisma/client";

const extractUsername = (users: User[]): Prisma.UserWhereUniqueInput[] => {
  return users.map((u) => {
    const { username } = u;
    return { username };
  });
};

export { extractUsername };
