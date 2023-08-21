import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  reservePrice: number;

  @IsNumber()
  @IsNotEmpty()
  auctionId: number;
}
