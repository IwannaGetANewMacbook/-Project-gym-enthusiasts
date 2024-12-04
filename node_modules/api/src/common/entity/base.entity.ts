import { Transform } from 'class-transformer';
import { format } from 'date-fns';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => {
    return format(new Date(value), 'yyyy-MM-dd HH:mm:ss');
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => {
    return format(new Date(value), 'yyyy-MM-dd HH:mm:ss');
  })
  updatedAt: Date;
}
