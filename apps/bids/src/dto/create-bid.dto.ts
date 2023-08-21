import { IsNumber } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  lotId: number;

  @IsNumber()
  amount: number;
}
