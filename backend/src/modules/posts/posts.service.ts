import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { Post } from '../../database/entities';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResult } from '../../common/interfaces';
import { PostRepository } from '../../database/repositories/post.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @Inject(PostRepository)
    private readonly postsRepo: PostRepository,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new post.
   */
  async create(dto: CreatePostDto): Promise<Post> {
    if (dto.authorUserId) {
      await this.usersService.findById(dto.authorUserId);
    }

    const post = this.postsRepo.create(dto);
    const saved = await this.postsRepo.save(post);

    this.logger.log(`Post created: "${saved.title}" (ID: ${saved.id})`);

    return this.findOne(saved.id);
  }

  /**
   * Lists posts with pagination, search and filters.
   */
  async findAll(query: FindPostsQueryDto): Promise<PaginatedResult<Post>> {
    return this.postsRepo.findPaginated(query);
  }

  /**
   * Gets a post by UUID with the author relation.
   */
  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  /**
   * Updates an existing post.
   */
  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    if (dto.authorUserId && dto.authorUserId !== post.authorUserId) {
      await this.usersService.findById(dto.authorUserId);
    }

    Object.assign(post, dto);
    await this.postsRepo.save(post);

    this.logger.log(`Post updated: "${post.title}" (ID: ${id})`);

    return this.findOne(id);
  }

  /**
   * Deletes a post by UUID.
   */
  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepo.remove(post);
    this.logger.log(`Post deleted: ID ${id}`);
  }
}
