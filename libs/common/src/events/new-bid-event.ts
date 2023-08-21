export class NewBidEvent {
  constructor(
    public readonly lotId: number,
    public readonly amount: number,
    public readonly bidder: number,
    public readonly created: Date,
    public readonly previousBidders: number[],
  ) {}

  toString() {
    return JSON.stringify({
      lotId: this.lotId,
      amount: this.amount,
      bidder: this.bidder,
      created: this.created,
      previousBidders: this.previousBidders,
    });
  }
}
