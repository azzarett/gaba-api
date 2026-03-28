import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivationDao, PromocodeDao } from '../../common/dao';
import { PromocodesRepository } from './data';
import { PromocodesService } from './domain';
import { PromocodesController } from './presenter';
import { PromocodeResource } from './presenter/resources';

@Module({
  imports: [TypeOrmModule.forFeature([PromocodeDao, ActivationDao])],
  controllers: [PromocodesController],
  providers: [PromocodesRepository, PromocodesService, PromocodeResource],
})
export class PromocodesModule {}
