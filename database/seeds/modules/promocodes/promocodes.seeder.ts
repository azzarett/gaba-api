import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromocodeDao } from '../../../../src/common/dao/promocode.dao';

@Injectable()
export class PromocodesSeeder {
  constructor(
    @InjectRepository(PromocodeDao)
    private readonly promocodeRepository: Repository<PromocodeDao>,
  ) {}

  async run() {
    const count = await this.promocodeRepository.count();
    if (count === 0) {
      await this.promocodeRepository.save([
        {
          code: 'PROMO10',
          discount: 10,
          activationLimit: 100,
          expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        },
        {
          code: 'PROMO50',
          discount: 50,
          activationLimit: 10,
          expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
        },
        {
          code: 'EXPIRED15',
          discount: 15,
          activationLimit: 50,
          expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // -1 day (expired)
        },
        {
          code: 'NOLIMIT20',
          discount: 20,
          activationLimit: 999999, // practically unlimited for testing
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 year
        },
        {
          code: 'ZERO_LIMIT',
          discount: 100,
          activationLimit: 0,
          expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      ]);
    }
  }
}
