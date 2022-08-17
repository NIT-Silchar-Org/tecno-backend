import { TeamMemberRole, RegistrationStatus } from "@prisma/client";

interface RegisterTeamBody {
  name: string;
  members: {
    username: string;
    role: TeamMemberRole;
  }[];
}

interface RegistrationResponse {
  status: RegistrationStatus;
}

export { RegisterTeamBody, RegistrationResponse };
