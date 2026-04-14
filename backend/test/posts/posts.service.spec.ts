import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from '../../src/modules/posts/posts.service';
import { PostRepository } from '../../src/database/repositories/post.repository';
import { UsersService } from '../../src/modules/users/users.service';
import { Post } from '../../src/database/entities/post.entity';
import { User } from '../../src/database/entities/user.entity';

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepo: jest.Mocked<
    Pick<
      PostRepository,
      'findOne' | 'findPaginated' | 'create' | 'save' | 'remove'
    >
  >;
  let usersService: jest.Mocked<Pick<UsersService, 'findById'>>;

  const mockAuthor = { id: 1, firstName: 'George', lastName: 'Bluth' } as User;

  const mockPost: Post = {
    id: 'uuid-1',
    title: 'Test Post',
    content: 'Content of the test post that has more than 10 characters',
    authorUserId: 1,
    reqresAuthorId: null,
    author: mockAuthor,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Post;

  beforeEach(async () => {
    postsRepo = {
      findOne: jest.fn(),
      findPaginated: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    usersService = { findById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PostRepository, useValue: postsRepo },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
  });

  describe('create', () => {
    it('should create a post correctly', async () => {
      const dto = {
        title: 'Test Post',
        content: 'Content of the test post that has more than 10 characters',
        authorUserId: 1,
      };

      usersService.findById.mockResolvedValue(mockAuthor);
      postsRepo.create.mockReturnValue(mockPost);
      postsRepo.save.mockResolvedValue(mockPost);
      postsRepo.findOne.mockResolvedValue(mockPost);

      const result = await postsService.create(dto);

      expect(result.title).toBe('Test Post');
      expect(postsRepo.save).toHaveBeenCalledTimes(1);
      expect(usersService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if author does not exist', async () => {
      usersService.findById.mockRejectedValue(new NotFoundException());

      await expect(
        postsService.create({
          title: 'Test',
          content: 'Long enough content to validate',
          authorUserId: 999,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(postsRepo.create).not.toHaveBeenCalled();
    });

    it('should create a post without an author', async () => {
      const postWithoutAuthor = {
        ...mockPost,
        authorUserId: null,
      } as unknown as Post;
      const dto = { title: 'No Author', content: 'Content with no author set' };

      postsRepo.create.mockReturnValue(postWithoutAuthor);
      postsRepo.save.mockResolvedValue(postWithoutAuthor);
      postsRepo.findOne.mockResolvedValue(postWithoutAuthor);

      await postsService.create(dto);

      expect(usersService.findById).not.toHaveBeenCalled();
      expect(postsRepo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should delegate pagination to the repository', async () => {
      const paginatedResult = {
        data: [],
        meta: {
          page: 2,
          limit: 5,
          total: 0,
          totalPages: 0,
          timestamp: '',
        },
      };
      postsRepo.findPaginated.mockResolvedValue(paginatedResult);

      const result = await postsService.findAll({ page: 2, limit: 5 });

      expect(postsRepo.findPaginated).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
      });
      expect(result).toBe(paginatedResult);
    });

    it('should pass search and filter params to the repository', async () => {
      const emptyResult = {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0, timestamp: '' },
      };
      postsRepo.findPaginated.mockResolvedValue(emptyResult);

      await postsService.findAll({ page: 1, limit: 10, search: 'react' });

      expect(postsRepo.findPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'react',
      });
    });
  });

  describe('findOne', () => {
    it('should return the post when found', async () => {
      postsRepo.findOne.mockResolvedValue(mockPost);

      const result = await postsService.findOne('uuid-1');

      expect(result).toBe(mockPost);
      expect(postsRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        relations: ['author'],
      });
    });

    it('should throw NotFoundException if post does not exist', async () => {
      postsRepo.findOne.mockResolvedValue(null);

      await expect(postsService.findOne('non-existent-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a post and return the updated entity', async () => {
      const updatedPost = {
        ...mockPost,
        title: 'Updated Title',
      } as unknown as Post;

      postsRepo.findOne
        .mockResolvedValueOnce(mockPost)
        .mockResolvedValueOnce(updatedPost);
      postsRepo.save.mockResolvedValue(updatedPost);

      const result = await postsService.update('uuid-1', {
        title: 'Updated Title',
      });

      expect(result.title).toBe('Updated Title');
      expect(postsRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should validate new author when authorUserId changes', async () => {
      postsRepo.findOne.mockResolvedValue(mockPost);
      usersService.findById.mockRejectedValue(new NotFoundException());

      await expect(
        postsService.update('uuid-1', { authorUserId: 999 }),
      ).rejects.toThrow(NotFoundException);

      expect(usersService.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('remove', () => {
    it('should remove the post when found', async () => {
      postsRepo.findOne.mockResolvedValue(mockPost);
      postsRepo.remove.mockResolvedValue(mockPost);

      await postsService.remove('uuid-1');

      expect(postsRepo.remove).toHaveBeenCalledWith(mockPost);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      postsRepo.findOne.mockResolvedValue(null);

      await expect(postsService.remove('non-existent-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
