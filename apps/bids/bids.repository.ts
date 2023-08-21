import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Bid } from './src/entities/bid.entity';

@Injectable()
export class BidsRepository extends AbstractRepository<Bid> {
  protected readonly logger = new Logger(BidsRepository.name);

  constructor(
    @InjectRepository(Bid)
    bidsRepository: Repository<Bid>,
    entityManager: EntityManager,
  ) {
    super(bidsRepository, entityManager);
  }
}
