import PusherMock from "./pusher-js-mock";
/**
 * Creates a mocked sync client for testing
 * @param id The ID to attach to the client
 * @param info The user info object
 */
export declare const createSyncPresenceClient: (id: string, info?: any) => PusherMock;
/**
 * Creates a mocked sync client for testing
 * @param id The ID to attach to the client
 * @param info The user info object
 */
export declare const createAsyncPresenceClient: (id: string, info?: any) => PusherMock;
