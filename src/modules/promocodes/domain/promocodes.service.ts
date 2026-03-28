import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ActivationDao, PromocodeDao } from '../../../common/dao';
import { Promocode } from '../../../common/entities';
import { PromocodesRepository } from '../data';

@Injectable()
export class PromocodesService {
  constructor(
    private readonly promocodesRepository: PromocodesRepository,
    private readonly dataSource: DataSource,
  ) {}

  getAllPromocodes(): Promise<Promocode[]> {
    return this.promocodesRepository.getAllPromocodes();
  }

  async getPromocodeById(promocodeId: string): Promise<Promocode> {
    const promocode =
      await this.promocodesRepository.getPromocodeById(promocodeId);

    if (!promocode) {
      throw new NotFoundException('Promocode not found');
    }

    return promocode;
  }

  async createPromocode(payload: {
    code: string;
    discount: number;
    activationLimit: number;
    expirationDate?: Date;
  }): Promise<Promocode> {
    const existingPromocode =
      await this.promocodesRepository.getPromocodeByCode(payload.code);

    if (existingPromocode) {
      throw new ConflictException('Promocode already exists');
    }

    return this.promocodesRepository.createPromocode(payload);
  }

  async activatePromocode(
    promocodeId: string,
    email: string,
  ): Promise<Promocode> {
    const normalizedEmail = email.trim().toLowerCase();

    return this.dataSource.transaction(async (manager) => {
      const promocodesRepository = manager.getRepository(PromocodeDao);
      const activationsRepository = manager.getRepository(ActivationDao);

      const promocode = await promocodesRepository
        .createQueryBuilder('promocode')
        .setLock('pessimistic_write')
        .where('promocode.id = :promocodeId', { promocodeId })
        .getOne();

      if (!promocode) {
        throw new NotFoundException('Promocode not found');
      }

      if (promocode.expirationDate && promocode.expirationDate < new Date()) {
        throw new BadRequestException('Promocode is expired');
      }

      const existingActivation = await activationsRepository.findOne({
        where: {
          promocodeId,
          email: normalizedEmail,
        },
      });

      if (existingActivation) {
        throw new ConflictException('Email already activated this promocode');
      }

      const activationsCount = await activationsRepository.count({
        where: { promocodeId },
      });

      if (activationsCount >= promocode.activationLimit) {
        throw new BadRequestException('Promocode activation limit reached');
      }

      await activationsRepository.save({
        promocodeId,
        email: normalizedEmail,
      });

      return promocode;
    });
  }
}
