import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/common';

export enum LotStatus {
  Upcoming = 'upcoming',
  Active = 'active',
  Closed = 'closed',
  Sold = 'sold',
  Passed = 'passed',
  Withdrawn = 'withdrawn',
}

@Entity()
export class Lot extends AbstractEntity<Lot> {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  reservePrice: number;

  @Column()
  auctionId: number;

  @Column()
  status: LotStatus;

  @Column()
  sellerId: number;
}
