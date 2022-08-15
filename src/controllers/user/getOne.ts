import * as Interfaces from "@interfaces";
import * as Utils from "@utils";
import { User } from "@prisma/client";

const getOneUserById: Interfaces.Controller.Async = async (_, res, _next) => {
  const user: User = {
    id: 123,
    firebaseId: "adakkd",
    balance: 22,
    collegeName: "NITS",
    email: "bhagwan@gmail.com",
    imageUrl:
      "http://www.mobiloitte.com/blhttp://www.mobiloitte.com/blog/wp-content/uploads/2019/07/New-Project-2019-07-15T110046.613.pngog/wp-content/uploads/2019/07/New-Project-2019-07-15T110046.613.png",
    name: "akbar",
    registrationId: "2012000",
    username: "birbal",
  };

  res.json(Utils.Response.Success<User>(user));
};

export { getOneUserById };
