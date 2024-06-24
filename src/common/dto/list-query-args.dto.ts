import {
  IsJSON,
  IsNumberString,
  IsOptional,
  IsBooleanString,
} from 'class-validator';

export class ListQueryArgsDto {
  @IsJSON()
  @IsOptional()
  select?: Record<string, any>;

  @IsJSON()
  @IsOptional()
  include?: Record<string, boolean>;

  @IsJSON()
  @IsOptional()
  orderBy?: Record<string, boolean>;

  @IsJSON()
  @IsOptional()
  where?: Record<string, any>;

  @IsNumberString()
  @IsOptional()
  skip?: number;

  @IsNumberString()
  @IsOptional()
  take?: number;

  @IsBooleanString()
  @IsOptional()
  includeCount?: boolean;
}
