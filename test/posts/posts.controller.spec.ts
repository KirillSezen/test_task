import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../../src/posts/posts.controller';
import { PostsService } from '../../src/posts/posts.service';
import { CreatePostDto } from '../../src/posts/dto/create-post.dto';
import { UpdatePostDto } from '../../src/posts/dto/update-post.dto';
import { FilterDto } from '../../src/users/dto/filter.dto';
import { PostEntity } from '../../src/posts/entities/post.entity';
import { JwtAuthGuard } from '../../src/guards/jwt-auth.guard';
import { UserGuard } from '../../src/guards/user.guard';
import { UserOrAdminGuard } from '../../src/guards/user-or-admin.guard';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(UserGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(UserOrAdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post',
      };
      const userId = 1;
      const expectedResult: PostEntity = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.create({ id: userId }, createPostDto);

      expect(service.create).toHaveBeenCalledWith(createPostDto, userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const filterDto: FilterDto = {
        search: 'Test',
      };
      const expectedResult: PostEntity[] = [
        {
          id: 1,
          title: 'Test Post 1',
          content: 'This is a test post 1',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Test Post 2',
          content: 'This is a test post 2',
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const postId = '1';
      const expectedResult: PostEntity = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service.findOne as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.findOne(postId);

      expect(service.findOne).toHaveBeenCalledWith(+postId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postId = '1';
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        content: 'This is an updated post',
      };
      const expectedResult: PostEntity = {
        id: 1,
        title: 'Updated Post',
        content: 'This is an updated post',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service.update as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.update(postId, updatePostDto);

      expect(service.update).toHaveBeenCalledWith(+postId, updatePostDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const postId = '1';
      const expectedResult: PostEntity = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service.remove as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.remove(postId);

      expect(service.remove).toHaveBeenCalledWith(+postId);
      expect(result).toEqual(expectedResult);
    });
  });
});
