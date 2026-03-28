import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { PromocodeDao } from './promocode.dao';

@Entity('activations')
@Unique(['promocodeId', 'email'])
export class ActivationDao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'promocode_id' })
  promocodeId: string;

  @Column({ type: 'varchar' })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => PromocodeDao, (promocode) => promocode.activations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'promocode_id' })
  promocode: PromocodeDao;
}
