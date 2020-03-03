import { Config } from "pusher-js";
import PusherPresenceChannelMock from "./pusher-presence-channel-mock";
/** Class representing fake Pusher Client. */
declare class PusherMock {
    id: string | undefined;
    info: Record<string, any> | undefined;
    clientKey: string | undefined;
    config: Config | undefined;
    channels: import("./pusher-js-mock-instance").IChannels;
    channel: (name: string, client?: PusherMock) => any;
    /** Initialize PusherMock */
    constructor(clientKey?: string, config?: Config);
    setAuthInfo(errored: boolean, auth: any): void;
    authorize(channel: PusherPresenceChannelMock): Promise<void>;
    /**
     * Mock subscribing to a channel.
     * @param {String} name - name of the channel.
     * @returns {PusherChannelMock} PusherChannelMock object that represents channel
     */
    subscribe(name: string): any;
    /**
     * Unsubscribe from a mocked channel.
     * @param {String} name - name of the channel.
     */
    unsubscribe(name: string): void;
}
export default PusherMock;
