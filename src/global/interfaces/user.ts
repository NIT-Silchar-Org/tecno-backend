interface CreateUserBody {
  firstName: string;
  middleName: string | "" | null | undefined;
  lastName: string;
  email: string;
  collegeName: string;
  registrationId: string | null | undefined;
  username: string;
  phoneNumber: string;

  imageUrl: string | null | undefined;
}

interface UserUpdateBody {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  middleName: string | null | undefined;
  collegeName: string | null | undefined;
  registrationId: string | null | undefined;
  imageUrl: string | null | undefined;
}

export { CreateUserBody, UserUpdateBody };
