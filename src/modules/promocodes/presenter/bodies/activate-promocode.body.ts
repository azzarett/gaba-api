import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivatePromocodeBody {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email that activates the promocode',
    maxLength: 320,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(320)
  email: string;
}
