import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPromocodeIdParams {
  @ApiProperty({
    format: 'uuid',
    example: 'a8a4af84-9457-4f33-b62c-71ee345eaaf7',
    description: 'Promocode id',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
