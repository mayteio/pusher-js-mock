import { PusherMock, PusherPresenceChannelMock } from '.';
export interface IProxiedCallback {
    (): () => void;
    owner: string;
}
/**
 * Proxies the instance of channel returned so we can still reference the
 * shared members object whilst passing our own ID & me properties
 */
export declare const proxyPresenceChannel: (channel: PusherPresenceChannelMock, client: PusherMock) => PusherPresenceChannelMock;
