import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocodeDao } from '../../../../src/common/dao/promocode.dao';
import { PromocodesSeeder } from './promocodes.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([PromocodeDao])],
  providers: [PromocodesSeeder],
  exports: [PromocodesSeeder],
})
export class PromocodesSeederModule {}
