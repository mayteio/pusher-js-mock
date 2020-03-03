import { PusherMock, PusherPresenceChannelMock } from ".";
/**
 * Emit connection events triggered by pusher
 * @param {PusherPresenceChannelMock} channel the channel we want to trigger this on
 * @param client the client we're using to emit the connection events
 * @returns void
 */
export declare const emitConnectionEvents: (channel: PusherPresenceChannelMock, client: PusherMock) => Promise<void>;
/**
 * Emit disconnection events triggered by pusher
 * @param {PusherPresenceChannelMock} channel the channel we want to trigger this on
 * @param client the client we're using to emit the connection events
 * @returns void
 */
export declare const emitDisconnectionEvents: (channel: PusherPresenceChannelMock, client: PusherMock) => void;
