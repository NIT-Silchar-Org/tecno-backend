import * as Interfaces from "@interfaces";

/**
 * @description Gives back a JSON
 * Object to send as response.
 *
 * @param msg Error message
 * @param status Status Code
 */

function error(msg: string, status = 500): Interfaces.JSON.Response {
  return {
    status,
    msg,
  };
}

export default error;
