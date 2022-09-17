import { Prisma } from "@prisma/client";

interface StaticsCreateBody {
  name: string;
  json: Prisma.InputJsonValue;
}

export { StaticsCreateBody };
