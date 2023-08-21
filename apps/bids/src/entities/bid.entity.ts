import { AbstractEntity } from '@app/common';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class Bid extends AbstractEntity<Bid> {
  @CreateDateColumn()
  created: Date;

  @Column()
  bidder: number;

  @Column()
  lotId: number;

  @Column()
  amount: number;
}
