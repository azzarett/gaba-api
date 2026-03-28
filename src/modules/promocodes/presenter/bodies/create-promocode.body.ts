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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePromocodeBody {
  @ApiProperty({
    example: 'SUMMER25',
    description: 'Unique promocode value',
    minLength: 1,
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  code: string;

  @ApiProperty({
    example: 25,
    description: 'Discount percent value from 1 to 100',
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  discount: number;

  @ApiProperty({
    example: 100,
    description: 'Maximum number of activations',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  activation_limit: number;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59.000Z',
    description: 'Promocode expiration datetime in ISO format',
  })
  @IsOptional()
  @IsDateString()
  expiration_date?: string;
}
