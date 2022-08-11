import * as Interfaces from "@interfaces";

const checkUser: Interfaces.Controller.Async = async (req, _res, _next) => {
  console.log(req.header);
};

export default checkUser;
