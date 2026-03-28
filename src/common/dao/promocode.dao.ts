import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ActivationDao } from './activation.dao';

@Entity('promocodes')
export class PromocodeDao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'int' })
  discount: number;

  @Column({ type: 'int', name: 'activation_limit' })
  activationLimit: number;

  @Column({ type: 'timestamp', name: 'expiration_date', nullable: true })
  expirationDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ActivationDao, (activation) => activation.promocode)
  activations: ActivationDao[];
}
