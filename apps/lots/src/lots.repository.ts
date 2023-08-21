import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Lot } from './entities/lot.entity';

@Injectable()
export class LotsRepository extends AbstractRepository<Lot> {
  protected readonly logger = new Logger(LotsRepository.name);

  constructor(
    @InjectRepository(Lot)
    lotsRepository: Repository<Lot>,
    entityManager: EntityManager,
  ) {
    super(lotsRepository, entityManager);
  }
}
