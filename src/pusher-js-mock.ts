import { Config } from "pusher-js";
import PusherMockInstance from "./pusher-js-mock-instance";
import PusherPresenceChannelMock from "./pusher-presence-channel-mock";
import { emitConnectionEvents, emitDisconnectionEvents } from "./pusherEvents";

/** Class representing fake Pusher Client. */
class PusherMock {
  public id: string | undefined = undefined;
  public info: Record<string, any> | undefined = undefined;
  public clientKey: string | undefined;
  public config: Config | undefined;

  public channels = PusherMockInstance.channels;
  public channel = PusherMockInstance.channel;

  /** Initialize PusherMock */
  constructor(clientKey?: string, config?: Config) {
    this.clientKey = clientKey;
    this.config = config;
    this.setAuthInfo = this.setAuthInfo.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  public setAuthInfo(errored: boolean, auth: any) {
    if (!errored) {
      this.id = auth.id;
      this.info = auth.info;
    }
  }

  public async authorize(channel: PusherPresenceChannelMock) {
    if (this.config?.authorizer) {
      await this.config
        .authorizer({} as any, {})
        .authorize(channel as any, this.setAuthInfo);
    } else {
      this.setAuthInfo(false, {
        id: Math.random()
          .toString(36)
          .substr(2, 9),
        info: {},
      } as any);
    }

    emitConnectionEvents(channel, this);
  }

  /**
   * Mock subscribing to a channel.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  public subscribe(name: string) {
    const channel = PusherMockInstance.channel(name, this);
    if (name.includes("presence-")) {
      this.authorize(channel);
    }

    return channel;
  }

  /**
   * Unsubscribe from a mocked channel.
   * @param {String} name - name of the channel.
   */
  public unsubscribe(name: string) {
    if (name in PusherMockInstance.channels) {
      if (name.includes("presence-")) {
        const channel = PusherMockInstance.channels[name];
        emitDisconnectionEvents(channel, this);
      }

      PusherMockInstance.channels[name].callbacks = {};
      delete PusherMockInstance.channels[name];
    }
  }
}

export default PusherMock;

// (function() {
//   const timeouts: any = [],
//     messageName = "nextTickPlz",
//     _nextTick = function(fn: () => void) {
//       timeouts.push(fn);
//       window.postMessage(messageName, "*");
//     },
//     _handleMessage = (event: any) => {
//       if (
//         event != null &&
//         event.source === window &&
//         event.data === messageName
//       ) {
//         event.stopPropagation();
//         if (timeouts.length > 0) {
//           var fn = timeouts.shift();
//           fn && fn();
//         }
//       }
//     };

//   window.addEventListener("message", _handleMessage, true);

//   (window as any).nextTick = _nextTick;
// })();
