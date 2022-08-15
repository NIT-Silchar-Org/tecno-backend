interface CreateUserBody {
  name: string;
  email: string;
  collegeName: string;
  registrationId: string;
  username: string;

  imageUrl: string | null | undefined;
}

export { CreateUserBody };
