import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsInt({ message: 'Must be Int' })
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: 'Must be Int' })
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
