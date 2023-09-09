import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { MultiFileTypeValidator } from '~/common/validator/multi-file-type.validator';
import { AuthUser } from '../auth/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RecipeCommentCreateRequestDto } from './dto/recipe-comment-create-request.dto';
import { RecipeCommentUpdateRequestDto } from './dto/recipe-comment-update-request.dto';
import { RecipeConditionRequestDto } from './dto/recipe-condition-request.dto';
import { RecipeCreateRequestDto } from './dto/recipe-create-request.dto';
import { RecipeUpdateRequestDto } from './dto/recipe-update-request.dto';
import { RecipeService } from './recipe.service';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('mode', new DefaultValuePipe('recent')) mode: string,
    @Body() request: RecipeConditionRequestDto,
  ) {
    return this.recipeService.findAll(page, size, mode, request.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @AuthUser() user: User) {
    return this.recipeService.findOne(id, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @AuthUser() user: User,
    @Body() request: RecipeCreateRequestDto,
  ) {
    return this.recipeService.createRecipe(user, request);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @AuthUser() user: User,
    @Body() request: RecipeUpdateRequestDto,
  ) {
    return this.recipeService.updateRecipe(id, user, request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number, @AuthUser() user: User) {
    return this.recipeService.deleteRecipe(id, user);
  }

  @Get(':id/comments')
  async findComments(@Param('id') id: number) {
    return this.recipeService.findComments(id);
  }

  @Get(':id/comments/:commentId')
  async findSubComments(
    @Param('id') id: number,
    @Param('commentId') commentId: number,
  ) {
    return this.recipeService.findSubComments(id, commentId);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') id: number,
    @AuthUser() user: User,
    @Body() request: RecipeCommentCreateRequestDto,
  ) {
    return this.recipeService.createComment(id, user, request);
  }

  @Patch(':id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('commentId') commentId: number,
    @AuthUser() user: User,
    @Body() request: RecipeCommentUpdateRequestDto,
  ) {
    return this.recipeService.updateComment(commentId, user, request);
  }

  @Delete(':id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('id') id: number,
    @Param('commentId') commentId: number,
    @AuthUser() user: User,
  ) {
    return this.recipeService.deleteComment(id, commentId, user);
  }

  @Post(':id/likes')
  @UseGuards(JwtAuthGuard)
  async likeRecipe(@Param('id') id: number, @AuthUser() user: User) {
    return this.recipeService.likeRecipe(id, user);
  }

  @Delete(':id/likes')
  @UseGuards(JwtAuthGuard)
  async unlikeRecipe(@Param('id') id: number, @AuthUser() user: User) {
    return this.recipeService.unlikeRecipe(id, user);
  }

  @Post(':id/bookmarks')
  @UseGuards(JwtAuthGuard)
  async bookmarkRecipe(@Param('id') id: number, @AuthUser() user: User) {
    return this.recipeService.bookmarkRecipe(id, user);
  }

  @Delete(':id/bookmarks')
  @UseGuards(JwtAuthGuard)
  async unBookmarkRecipe(@Param('id') id: number, @AuthUser() user: User) {
    return this.recipeService.unBookmarkRecipe(id, user);
  }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @AuthUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new MultiFileTypeValidator({ fileTypes: ['jpg', 'jpeg', 'png'] }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.recipeService.uploadImage(user, image);
  }
}
