import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RoleDto {
  @IsOptional()
  @IsNumber()
  id?: number; // This is the id of the role if we want to reference an existing role

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
