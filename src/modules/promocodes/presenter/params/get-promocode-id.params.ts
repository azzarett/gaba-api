import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetPromocodeIdParams {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
