import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { UserOrAdminGuard } from '../auth/guards/user-or-admin.guard';
import { FilterDto } from '../users/dto/filter.dto';
import { User } from '../auth/decorators/user.decorator';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create post' })
  @ApiCreatedResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() user, @Body() createPostDto: CreatePostDto) {
    const userId = user.id;
    return this.postsService.create(createPostDto, userId);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({ type: PostEntity, isArray: true })
  @Get()
  findAll(@Query() filterDto: FilterDto) {
    return this.postsService.findAll(filterDto);
  }

  @ApiOperation({ summary: 'Get post' })
  @ApiOkResponse({ type: PostEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard, UserGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard, UserOrAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
