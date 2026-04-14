import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Post } from './post.entity';

/**
 * User entity
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('IDX_USER_REQRES_ID', { unique: true })
  @Column({ name: 'reqres_id', unique: true })
  reqresId!: number;

  @Index('IDX_USER_EMAIL', { unique: true })
  @Column({ name: 'email', length: 255, unique: true })
  email!: string;

  @Column({ name: 'first_name', length: 100 })
  firstName!: string;

  @Column({ name: 'last_name', length: 100 })
  lastName!: string;

  @Column({ name: 'avatar', type: 'text', nullable: true })
  avatar!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];
}
