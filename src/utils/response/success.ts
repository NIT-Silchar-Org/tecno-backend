import * as Interfaces from "@interfaces";

/**
 * @description Gives back a JSON
 * Object to send as response.
 *
 * @param msg Success message
 */
function success<T = string>(msg: T): Interfaces.JSON.Response<T> {
  return {
    status: 200,
    msg,
  };
}

export default success;
