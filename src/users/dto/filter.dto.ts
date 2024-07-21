import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class FilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: string;
}
