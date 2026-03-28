import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class ActivatePromocodeBody {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(320)
  email: string;
}
