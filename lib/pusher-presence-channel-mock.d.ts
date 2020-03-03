import Members from "./members";
import PusherChannelMock from "./pusher-channel-mock";
/** Basic augmentation of the PusherChannel class. */
declare class PusherPresenceChannelMock extends PusherChannelMock {
    members: Members;
    /** Alias to match actual API for client events */
    trigger: (name: string, data?: any) => void;
    IS_PROXY?: boolean;
    /**
     * Initialise members object when created.
     * `pusher-js` provides all the functionality we need.
     * @param name The name of the channel to initialise
     * @returns PusherPresenceChannelMock the mocked presence channel
     */
    constructor(name?: string);
}
export default PusherPresenceChannelMock;
