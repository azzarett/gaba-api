import { Injectable } from '@nestjs/common';
import { Promocode } from 'src/common/entities';

@Injectable()
export class PromocodeResource {
  convert(payload: Promocode) {
    return {
      id: payload.id,
      code: payload.code,
      discount: payload.discount,
      activation_limit: payload.activationLimit,
      expiration_date: payload.expirationDate,
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    };
  }
}
