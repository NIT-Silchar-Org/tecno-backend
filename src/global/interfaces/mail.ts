type MailOptions = (
  email: string,
  html: string,
  subject: string
) => Promise<any>;

export { MailOptions };
