import { Injectable } from '@nestjs/common';
import { PromocodesSeeder } from './modules/promocodes/promocodes.seeder';

@Injectable()
export class Seeder {
  constructor(private readonly promocodesSeeder: PromocodesSeeder) {}

  async seed() {
    await this.promocodesSeeder.run();
  }
}
