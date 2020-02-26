"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Proxies the instance of channel returned so we can still reference the
 * shared members object whilst passing our own ID & me properties
 */
exports.proxyPresenceChannel = function (channel, client) {
    // proxy the request so me and myID remain unique to the client in question
    var handler = {
        get: function (target, name) {
            switch (name) {
                // attach this client's info the member specific calls
                case 'me':
                    return target.members.get(client.id);
                case 'myID':
                    return client.id;
                // attach the owner of the callback so we can ignore it in future
                case 'bind':
                    return function bind(eventName, callback) {
                        callback.owner = client.id;
                        target.bind(eventName, callback);
                    };
                // check the owner of the callback is not this client and then trigger it.
                case 'emit':
                    return function emit(eventName, data) {
                        var callbacks = target.callbacks[eventName];
                        var internals = ['pusher:subscription_succeeded'];
                        if (callbacks) {
                            callbacks.forEach(function (cb) {
                                // if the eventName is internal, only call this callback if the owner is me
                                // if the eventName isn't internal, only call this callback if the owner is not me
                                if ((internals.includes(eventName) && cb.owner === client.id) ||
                                    (!internals.includes(eventName) && cb.owner !== client.id)) {
                                    cb(data);
                                }
                            });
                        }
                    };
                case 'IS_PROXY':
                    return true;
                // return other class members as they were
                default:
                    return target[name];
            }
        },
    };
    var proxiedChannel = new Proxy(channel, handler);
    setTimeout(function () {
        proxiedChannel.members.addMember({
            user_id: client.id,
            user_info: client.info,
        });
        /** Add the member to the members object when proxied.  */
        proxiedChannel.emit('pusher:member_added', {
            id: client.id,
            info: client.info,
        });
        proxiedChannel.emit('pusher:subscription_succeeded', proxiedChannel.members);
    });
    return proxiedChannel;
};
