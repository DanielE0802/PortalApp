import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities';
import { FindPostsQueryDto } from '../../modules/posts/dto/find-posts-query.dto';
import { buildPaginationMeta } from '../../common/helpers';
import { PaginatedResult } from '../../common/interfaces';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(
    @InjectRepository(Post)
    private readonly _repository: Repository<Post>,
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  /**
   * Paginated, filtered, and ordered list of posts with their authors.
   */
  async findPaginated(
    query: FindPostsQueryDto,
  ): Promise<PaginatedResult<Post>> {
    const {
      page = 1,
      limit = 10,
      search,
      authorUserId,
      reqresAuthorId,
      orderBy = 'newest',
    } = query;

    const qb = this.createQueryBuilder('post').leftJoinAndSelect(
      'post.author',
      'author',
    );

    if (search) {
      qb.andWhere('post.title ILIKE :search', { search: `%${search}%` });
    }
    if (authorUserId) {
      qb.andWhere('post.authorUserId = :authorUserId', { authorUserId });
    }
    if (reqresAuthorId) {
      qb.andWhere('post.reqresAuthorId = :reqresAuthorId', { reqresAuthorId });
    }

    const orderMap: Record<
      string,
      { column: string; direction: 'ASC' | 'DESC' }
    > = {
      newest: { column: 'post.createdAt', direction: 'DESC' },
      oldest: { column: 'post.createdAt', direction: 'ASC' },
      title: { column: 'post.title', direction: 'ASC' },
    };

    const order = orderMap[orderBy] ?? orderMap.newest;
    qb.orderBy(order.column, order.direction)
      .skip((page - 1) * limit)
      .take(limit);

    const [posts, total] = await qb.getManyAndCount();

    return {
      data: posts,
      meta: buildPaginationMeta({ page, limit, total }),
    };
  }
}
