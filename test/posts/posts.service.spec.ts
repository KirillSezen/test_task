import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../../src/posts/posts.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { FilterService } from '../../src/posts/filter.service';
import { CreatePostDto } from '../../src/posts/dto/create-post.dto';
import { UpdatePostDto } from '../../src/posts/dto/update-post.dto';
import { FilterDto } from '../../src/users/dto/filter.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;
  let filterService: FilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: FilterService,
          useValue: {
            filterPosts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
    filterService = module.get<FilterService>(FilterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post',
      };
      const userId = 1;
      const expectedResult = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.post.create as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.create(createPostDto, userId);

      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: { ...createPostDto, userId },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return filtered posts', async () => {
      const filterDto: FilterDto = {
        search: 'Post 1',
      };
      const expectedResult = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Post 2',
          content: 'Content 2',
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (filterService.filterPosts as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findAll(filterDto);

      expect(filterService.filterPosts).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const postId = 1;
      const expectedResult = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.post.findUnique as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findOne(postId);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if post is not found', async () => {
      const postId = 1;

      (prismaService.post.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(postId)).rejects.toThrow(
        new HttpException(
          'Post with such id doesnt exist',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        content: 'This is an updated post',
      };
      const existingPost = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedResult = {
        id: 1,
        title: 'Updated Post',
        content: 'This is an updated post',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.post.findUnique as jest.Mock).mockResolvedValue(
        existingPost,
      );
      (prismaService.post.update as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.update(postId, updatePostDto);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: updatePostDto,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if post is not found', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        content: 'This is an updated post',
      };

      (prismaService.post.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(postId, updatePostDto)).rejects.toThrow(
        new HttpException(
          'Post with such id doesnt exist',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const postId = 1;
      const existingPost = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedResult = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.post.findUnique as jest.Mock).mockResolvedValue(
        existingPost,
      );
      (prismaService.post.delete as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.remove(postId);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(prismaService.post.delete).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if post is not found', async () => {
      const postId = 10;

      (prismaService.post.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(postId)).rejects.toThrow(
        new HttpException(
          'Post with such id doesnt exist',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
