export class UserOutbidEvent {
  constructor(public readonly previousBidders: number[]) {}

  toString() {
    return JSON.stringify({
      previousBidders: this.previousBidders,
    });
  }
}
