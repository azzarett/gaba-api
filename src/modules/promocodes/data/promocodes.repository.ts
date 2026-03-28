import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivationDao, PromocodeDao } from 'src/common/dao';
import { Activation, Promocode } from 'src/common/entities';

@Injectable()
export class PromocodesRepository {
  constructor(
    @InjectRepository(PromocodeDao)
    private readonly promocodesRepository: Repository<PromocodeDao>,
    @InjectRepository(ActivationDao)
    private readonly activationsRepository: Repository<ActivationDao>,
  ) {}

  getAllPromocodes(): Promise<Promocode[]> {
    return this.promocodesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  getPromocodeById(id: string): Promise<Promocode | null> {
    return this.promocodesRepository.findOne({
      where: { id },
    });
  }

  getPromocodeByCode(code: string): Promise<Promocode | null> {
    return this.promocodesRepository.findOne({
      where: { code },
    });
  }

  createPromocode(payload: {
    code: string;
    discount: number;
    activationLimit: number;
    expirationDate?: Date;
  }): Promise<Promocode> {
    return this.promocodesRepository.save({
      code: payload.code,
      discount: payload.discount,
      activationLimit: payload.activationLimit,
      expirationDate: payload.expirationDate,
    });
  }

  async activatePromocode(payload: {
    promocodeId: string;
    email: string;
  }): Promise<void> {
    await this.activationsRepository.save({
      promocodeId: payload.promocodeId,
      email: payload.email.toLowerCase(),
    });
  }

  countPromocodeActivations(promocodeId: string): Promise<number> {
    return this.activationsRepository.count({
      where: { promocodeId },
    });
  }

  getActivationByPromocodeIdAndEmail(
    promocodeId: string,
    email: string,
  ): Promise<Activation | null> {
    return this.activationsRepository.findOne({
      where: {
        promocodeId,
        email: email.toLowerCase(),
      },
    });
  }
}
