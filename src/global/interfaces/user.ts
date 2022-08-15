interface CreateUserBody {
  name: string;
  email: string;
  collegeName: string;
  registrationId: string;

  imageUrl: string | null;
}

export { CreateUserBody };
