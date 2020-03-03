import PusherMockInstance from "../pusher-js-mock-instance";
import PusherMock from "../pusher-js-mock";

describe("PusherMockInstace", () => {
  it("should reset when the reset method is called", () => {
    const client = new PusherMock();
    client.subscribe("test-channel");

    expect(Object.keys(PusherMockInstance.channels)).toContain("test-channel");
    PusherMockInstance.reset();
    expect(PusherMockInstance.channels).toEqual({});
  });
});
