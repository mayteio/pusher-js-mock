import { AuthInfo } from "pusher-js";
import PusherMock from "./pusher-js-mock";

/**
 * Creates a mocked sync client for testing
 * @param id The ID to attach to the client
 * @param info The user info object
 */
export const createSyncPresenceClient = (id: string, info: any = {}) =>
  new PusherMock("key", {
    authorizer: () => ({
      authorize: (socketId, callback) => {
        callback(false, ({ id, info } as unknown) as AuthInfo);
      },
    }),
  });

/**
 * Creates a mocked sync client for testing
 * @param id The ID to attach to the client
 * @param info The user info object
 */
export const createAsyncPresenceClient = (id: string, info: any = {}) =>
  new PusherMock("key", {
    authorizer: () => ({
      authorize: async (socketId, callback) => {
        await Promise.resolve();
        callback(false, ({ id, info } as unknown) as AuthInfo);
      },
    }),
  });
