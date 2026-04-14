import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { User } from '../../database/entities';
import { ImportUserResponseDto } from './dto/import-user-response.dto';
import { ReqresUserDto } from './dto/reqres-user.dto';
import { PaginatedMeta } from '../../common/interfaces';
import { UserRepository } from '../../database/repositories/user.repository';
import { ReqResUsersAdapter } from './adapter/reqres-users.adapter';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(UserRepository)
    private readonly usersRepository: UserRepository,
    private readonly reqResUsersAdapter: ReqResUsersAdapter,
  ) {}

  /**
   * Imports a user from ReqRes and persists it in the local database.
   */
  async importUser(reqresId: number): Promise<ImportUserResponseDto> {
    const existing = await this.usersRepository.findOne({
      where: { reqresId },
    });

    if (existing) {
      this.logger.log(`User #${reqresId} already exists in database`);
      return { ...this.mapToDto(existing), alreadyExisted: true };
    }

    const reqresUser = await this.reqResUsersAdapter.getUserById(reqresId);

    const user = this.usersRepository.create({
      reqresId: reqresUser.id,
      email: reqresUser.email,
      firstName: reqresUser.first_name,
      lastName: reqresUser.last_name,
      avatar: reqresUser.avatar ?? null,
    });

    const saved = await this.usersRepository.save(user);
    this.logger.log(
      `User imported: ${saved.firstName} ${saved.lastName} (reqresId: ${reqresId})`,
    );

    return { ...this.mapToDto(saved), alreadyExisted: false };
  }

  /**
   * Paginated list of locally saved users.
   */
  async findSavedUsers(
    page: number,
    limit: number,
  ): Promise<{
    data: (ImportUserResponseDto & { postCount?: number })[];
    meta: PaginatedMeta;
  }> {
    const { data: users, meta } = await this.usersRepository.findSavedPaginated(
      page,
      limit,
    );

    return {
      data: users.map((u) => ({
        ...this.mapToDto(u),
        alreadyExisted: true,
        postCount: u.postCount,
      })),
      meta,
    };
  }

  /**
   * Gets a saved user by their local ID.
   */
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  /**
   * Deletes a saved user.
   */
  async deleteUser(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
    this.logger.log(`User deleted: ID ${id}`);
  }

  /**
   * Lists users from ReqRes with pagination.
   */
  async findReqresUsers(page: number): Promise<{
    data: ReqresUserDto[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }> {
    const response = await this.reqResUsersAdapter.getUserList(page);

    const reqresIds = response.data.map((u) => u.id);
    const savedUsers = await this.usersRepository.findByReqresIds(reqresIds);
    const savedMap = new Map(savedUsers.map((u) => [u.reqresId, u.id]));

    return {
      data: response.data.map((user) => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        isSaved: savedMap.has(user.id),
        localId: savedMap.get(user.id) ?? null,
      })),
      page: response.page,
      per_page: response.per_page,
      total: response.total,
      total_pages: response.total_pages,
    };
  }

  /**
   * Gets the detail of a user from ReqRes by their ID.
   */
  async findReqresUserById(reqresId: number): Promise<ReqresUserDto> {
    // Throws NotFoundException if not found (mapped in the adapter)
    const user = await this.reqResUsersAdapter.getUserById(reqresId);

    const saved = await this.usersRepository.findOne({ where: { reqresId } });

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
      isSaved: !!saved,
      localId: saved?.id ?? null,
    };
  }

  private mapToDto(user: User): Omit<ImportUserResponseDto, 'alreadyExisted'> {
    return {
      id: user.id,
      reqresId: user.reqresId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }
}
