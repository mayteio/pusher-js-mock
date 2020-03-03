import Pusher from "pusher-js";
import { getAuthSomehow } from "./getAuthSomehow";

export const createClient = ({ id, info }) =>
  new Pusher("APP_KEY", {
    cluster: "APP_CLUSTER",
    // see https://github.com/pusher/pusher-js#authorizer-function
    authorizer: ({ name }) => ({
      authorize: async (socketId, callback) => {
        const auth = await getAuthSomehow(id, info);
        callback(false, auth);
      },
    }),
  });

export default createClient;
