"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pusher_js_mock_instance_1 = require("./pusher-js-mock-instance");
var pusherEvents_1 = require("./pusherEvents");
/** Class representing fake Pusher Client. */
var PusherMock = /** @class */ (function () {
    /** Initialize PusherMock */
    function PusherMock(clientKey, config) {
        this.id = undefined;
        this.info = undefined;
        this.channels = pusher_js_mock_instance_1.default.channels;
        this.channel = pusher_js_mock_instance_1.default.channel;
        this.clientKey = clientKey;
        this.config = config;
        this.setAuthInfo = this.setAuthInfo.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
    }
    PusherMock.prototype.setAuthInfo = function (errored, auth) {
        if (!errored) {
            this.id = auth.id;
            this.info = auth.info;
        }
    };
    PusherMock.prototype.authorize = function (channel) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.config) === null || _a === void 0 ? void 0 : _a.authorizer)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.config
                                .authorizer({}, {})
                                .authorize(channel, this.setAuthInfo)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.setAuthInfo(false, {
                            id: Math.random()
                                .toString(36)
                                .substr(2, 9),
                            info: {},
                        });
                        _b.label = 3;
                    case 3:
                        pusherEvents_1.emitConnectionEvents(channel, this);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Mock subscribing to a channel.
     * @param {String} name - name of the channel.
     * @returns {PusherChannelMock} PusherChannelMock object that represents channel
     */
    PusherMock.prototype.subscribe = function (name) {
        var channel = pusher_js_mock_instance_1.default.channel(name, this);
        if (name.includes("presence-")) {
            this.authorize(channel);
        }
        return channel;
    };
    /**
     * Unsubscribe from a mocked channel.
     * @param {String} name - name of the channel.
     */
    PusherMock.prototype.unsubscribe = function (name) {
        if (name in pusher_js_mock_instance_1.default.channels) {
            if (name.includes("presence-")) {
                var channel = pusher_js_mock_instance_1.default.channels[name];
                pusherEvents_1.emitDisconnectionEvents(channel, this);
            }
            pusher_js_mock_instance_1.default.channels[name].callbacks = {};
            delete pusher_js_mock_instance_1.default.channels[name];
        }
    };
    return PusherMock;
}());
exports.default = PusherMock;
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
