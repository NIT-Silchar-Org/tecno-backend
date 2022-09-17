import { RegistrationStatus } from "@prisma/client";

interface RegisterTeamBody {
  name: string;
  members: string[];
  extraInformation: object;
}

interface RegistrationResponse {
  status: RegistrationStatus;
}

export { RegisterTeamBody, RegistrationResponse };
