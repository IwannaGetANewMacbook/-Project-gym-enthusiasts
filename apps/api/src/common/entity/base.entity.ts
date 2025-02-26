import { Transform } from 'class-transformer';
// import { format } from 'date-fns';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => value.toISOString()) // ISO 8601 포맷으로 변환
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => value.toISOString()) // ISO 8601 포맷으로 변환
  updatedAt: Date;
}
