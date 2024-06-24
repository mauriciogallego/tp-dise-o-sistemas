import { IsJSON, IsOptional } from 'class-validator';

export class GetQueryArgsDto {
  @IsJSON()
  @IsOptional()
  select?: Record<string, any>;

  @IsJSON()
  @IsOptional()
  include?: Record<string, boolean>;

  @IsJSON()
  @IsOptional()
  where?: Record<string, any>;

  @IsJSON()
  @IsOptional()
  orderBy?: Record<string, 'asc' | 'desc'>;
}
