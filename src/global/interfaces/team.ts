import { RegistrationStatus } from "@prisma/client";

interface RegisterTeamBody {
  name: string;
  members: string[];
}

interface RegistrationResponse {
  status: RegistrationStatus;
}

export { RegisterTeamBody, RegistrationResponse };
