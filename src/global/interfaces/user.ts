interface CreateUserBody {
  name: string;
  email: string;
  collegeName: string;
  registrationId: string;
  username: string;

  imageUrl: string | null | undefined;
}

interface UserUpdateBody {
  name: string | null | undefined;
  collegeName: string | null | undefined;
  registrationId: string | null | undefined;
  imageUrl: string | null | undefined;
}

export { CreateUserBody, UserUpdateBody };
