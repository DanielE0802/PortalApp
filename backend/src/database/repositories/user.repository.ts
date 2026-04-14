import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { buildPaginationMeta } from '../../common/helpers';
import { PaginatedResult } from '../../common/interfaces';

export type UserWithPostCount = User & { postCount?: number };

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>,
  ) {
    super(_repository.target, _repository.manager, _repository.queryRunner);
  }

  /**
   * Paginated list of saved users with post count loaded via relation.
   * Ordered by createdAt DESC.
   */
  async findSavedPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResult<UserWithPostCount>> {
    const [users, total] = await this.createQueryBuilder('user')
      .loadRelationCountAndMap('user.postCount', 'user.posts')
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: users as UserWithPostCount[],
      meta: buildPaginationMeta({ page, limit, total }),
    };
  }

  /**
   * Batch-lookup of users by a list of ReqRes IDs.
   * Used to enrich proxy responses from the ReqRes API.
   * Returns an empty array when reqresIds is empty.
   */
  async findByReqresIds(reqresIds: number[]): Promise<User[]> {
    if (reqresIds.length === 0) return [];
    return this.createQueryBuilder('user')
      .where('user.reqresId IN (:...ids)', { ids: reqresIds })
      .getMany();
  }
}
