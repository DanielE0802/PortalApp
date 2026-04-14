import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Post entity.
 */
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Index('IDX_POST_AUTHOR')
  @Column({ name: 'author_user_id', type: 'int', nullable: true })
  authorUserId: number | null;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn({ name: 'author_user_id' })
  author!: User | null;

  @Column({ name: 'reqres_author_id', type: 'int', nullable: true })
  reqresAuthorId: number | null;

  @Index('IDX_POST_CREATED_AT')
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
