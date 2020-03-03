[![npm version](https://badge.fury.io/js/pusher-js-mock.svg)](https://badge.fury.io/js/pusher-js-mock)
[![Build Status](https://semaphoreci.com/api/v1/nikolalsvk/pusher-js-mock/branches/master/shields_badge.svg)](https://semaphoreci.com/nikolalsvk/pusher-js-mock)
[![Code Climate](https://codeclimate.com/github/nikolalsvk/pusher-js-mock/badges/gpa.svg)](https://codeclimate.com/github/nikolalsvk/pusher-js-mock)
[![Test Coverage](https://codeclimate.com/github/nikolalsvk/pusher-js-mock/badges/coverage.svg)](https://codeclimate.com/github/nikolalsvk/pusher-js-mock/coverage)
[![Open Source Helpers](https://www.codetriage.com/nikolalsvk/pusher-js-mock/badges/users.svg)](https://www.codetriage.com/nikolalsvk/pusher-js-mock)

![pusher-js-mock logo](https://raw.githubusercontent.com/nikolalsvk/pusher-js-mock/master/logo.jpg)

# pusher-js-mock

Mock [Pusher.js](https://github.com/pusher/pusher-js) in your JavaScript tests with ease

### Installing ⏬

Using yarn:

```
yarn add --dev pusher-js-mock
```

Or using npm:

```
npm install -D pusher-js-mock
```

### Usage 🛠

- [Emitting an event in tests](#emitting-an-event-in-tests)
- [Stubbing Pusher when imported from pusher-js package](#stubbing-pusher-when-imported-from-pusher-js-package)
- [Stubbing Pusher when used as a global variable](#stubbing-pusher-when-used-as-a-global-variable)
- [Mocking presence channels](#using-presence-channels)

For more detailed examples, check out [`examples` directory](https://github.com/nikolalsvk/pusher-js-mock/tree/master/examples)
inside the project!

Also, you can check out the
[Docs](https://nikolalsvk.github.io/pusher-js-mock/) for even more information.

#### Emitting an event in tests

If you need to mock a Pusher object in your tests that can
subscribe to channel, it's best to use PusherMock.

```javascript
import { PusherMock } from "pusher-js-mock";

// initializing PusherMock
const pusher = new PusherMock();

// subscribing to a Pusher channel
const channel = pusher.subscribe("my-channel");

// emitting an event
channel.emit("event-name");
```

#### Stubbing Pusher when imported from pusher-js package

If you're using Pusher in your code in this or similar manner:

```javascript
import Pusher from "pusher-js";
```

You will need to mock Pusher in a specific way.

I suggest you use [Jest](https://jestjs.io/) to test your code.
To do this in Jest, you'll need something like this:

```javascript
jest.mock("pusher-js", () => {
  const Pusher = require("pusher-js-mock").PusherMock;
  return Pusher;
});
```

If you have tips on how to mock this using other testing frameworks, please
submit an issue or a pull request.

#### Stubbing Pusher when used as a global variable

This shows how to stub a pusher if you're attaching it to window object in your
project. If you're attaching a PusherFactory to a `window` object like this in
your code:

```javascript
window.PusherFactory = {
  pusherClient: function(pusherKey) {
    return new Pusher(pusherKey);
  },
};
```

It's best for you to use PusherFactoryMock.

```javascript
import { PusherFactoryMock } from "pusher-js-mock";

// initialize instance of PusherFactoryMock
const pusherFactoryMock = new PusherFactoryMock();
// replace it with the object that is attached to a window
window.PusherFactory = pusherFactoryMock;

// get the Pusher client reference
pusher = pusherFactoryMock.pusherClient();
```

This way you'll just replace your PusherFactory with PusherFactoryMock.

#### Using presence channels

This package also supports using presence channels for multiple clients. The mock will automatically detect when `presence-` is in the channel name and return a presence channel with `channel.members` filled out as expected. You can pass in IDs and info via a custom authorizer, just as you would with the real package.

Unfortunately due to the nature of async testing in jest, there are a few rules:

1. Return an object `{id, info}` where the auth key would normally go in the callback, i.e.

```js
authorize: (socketId, callback) => callback(false, { id, info });
```

2. If your authorizer is async, you'll have to wrap your assertions in `process.nextTick` to allow the promise to resolve and set the ID & info.

```js
// given this Pusher config with async auth
{
  authorizer: () => ({
    authorize: async (socketId, callback) =>
    Promise.resolve().then(() => callback(false, { id, info }))
  })
}

// do this in your tests
const channel = client.subscribe("presence-channel")
process.nextTick(() => {
  expect(channel.members.myID).toBe("my-id")
})
...
```

3. If you're using an syncronous authorizer, you can put `await new Promise(setImmediate)` above your assertions to flush internal promises and apply your id & info to the client:

```js
// given this Pusher config with sync auth
{
  authorizer: () => ({
    authorize: (socketId, callback) => callback(false, { id, info }),
  });
}

// do this in your tests
const channel = client.subscribe("presence-channel");
await new Promise(setImmediate);
expect(channel.members.myID).toBe("my-id");
```

If you're using React, you'll have to wrap it further in act:

```js
await act(async () => await new Promise(setImmediate));
```

Here's an example:

```js
// create-client.js
import Pusher from "pusher-js";
import { getAuthSomehow } from "./getAuthSomehow";

export const createClient = ({ id, info }) =>
  new Pusher("APP_KEY", {
    cluster: "APP_CLUSTER",
    // see https://github.com/pusher/pusher-js#authorizer-function
    authorizer: ({ name }) => ({
      authorize: async (socketId, callback) => {
        const auth = await getAuthSomehow(id, info);
        callback(false, auth);
      },
    }),
  });

export default createClient;
```

```js
// create-client.spec.js
import createClient from "../create-client";

// mock the authorize function and pusher
jest.mock("pusher-js", () => require("pusher-js-mock"));
jest.mock("../getAuthSomehow", () => ({
  // async auth result resolves to { id, info } object, which gets set in the client
  getAuthSomehow: (id, info) => Promise.resolve({ id, info }),
}));

it("should create a presence channel", async () => {
  // arrange: create pusher client
  const pusher = createClient({ id: "my-id", info: { role: "moderator" } });

  // act: required to ensure pusher events are called, i.e. pusher:member_added
  const presenceChannel = await pusher.subscribe("presence-channel");

  // process.nextTick wraps our assertions to ensure the promise has resolved.
  process.nextTick(() => {
    // assert: presenceChannel has the properties we expect it to.
    expect(presenceChannel.members.myID).toBe("my-id");
    expect(presenceChannel.members.me).toEqual({
      id: "my-id",
      info: { role: "moderator" },
    });
    expect(presenceChannel.members.members).toEqual({
      "my-id": { role: "moderator" },
    });
  });
});
```

[Check out a code example of using presence channels](https://github.com/nikolalsvk/pusher-js-mock/tree/master/examples/presence-channels)

### [Code of Conduct](CODE_OF_CODUCT.md)

### [Contributing](CONTRIBUTING.md)

### Credits

Photo by [Octavian Rosca on Unsplash](https://unsplash.com/@tavi004)
