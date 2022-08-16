interface CreateUserBody {
  name: string;
  email: string;
  collegeName: string;
  registrationId: string;
  username: string;

  imageUrl: string | null | undefined;
}

interface UserImgUpdateBody {
  imageUrl: string;
}

export { CreateUserBody, UserImgUpdateBody };
