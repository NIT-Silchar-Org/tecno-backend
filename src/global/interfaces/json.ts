interface Response<T = string> {
  success: boolean;
  msg: T;
}

export { Response };
