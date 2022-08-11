import { TeamMemberRole, RegistrationStatus } from "@prisma/client";

interface RegisterTeamBody {
  name: string;
  members: {
    username: string;
    role: TeamMemberRole;
  }[];
}

interface ResgitrationResponse {
  status: RegistrationStatus;
}

export { RegisterTeamBody, ResgitrationResponse };
