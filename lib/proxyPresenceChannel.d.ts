import { PusherMock, PusherPresenceChannelMock } from ".";
export interface IProxiedCallback {
    (): (data?: any) => void;
    owner: string;
}
/**
 * Proxies the instance of channel returned so we can still reference the
 * shared members object whilst passing our own ID & me properties
 *
 * @param {PusherPresenceChannelMock} channel The channel we're mocking
 * @param {PusherMock} client the client we want to use to proxy the channel
 */
export declare const proxyPresenceChannel: (channel: PusherPresenceChannelMock, client: PusherMock) => PusherPresenceChannelMock;
