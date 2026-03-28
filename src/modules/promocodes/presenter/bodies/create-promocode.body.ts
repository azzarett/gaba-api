import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreatePromocodeBody {
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  code: string;

  @IsInt()
  @Min(1)
  @Max(100)
  discount: number;

  @IsInt()
  @Min(1)
  activation_limit: number;

  @IsOptional()
  @IsDateString()
  expiration_date?: string;
}
