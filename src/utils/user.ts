/**
 * @description validates the username with regexp
 * @param username string to be validate
 * @returns returns true if string satisfies the regexp otherwise false
 */

const validateUsername = (username: string): boolean => {
  const checkUsername = new RegExp("^[a-z0-9A-Z_.$]+$");

  const result = checkUsername.test(username);

  return result;
};

const validatePhoneNumber = (phoneNumber: string): boolean => {
  const checkPhoneNumber = new RegExp("^[0-9]+$");

  if (phoneNumber.length !== 10) return false;

  const result = checkPhoneNumber.test(phoneNumber);

  return result;
};

export { validateUsername, validatePhoneNumber };
