import {
  Body,
  Controller,
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
import { AuthUser } from '../auth/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RecipeCommentCreateRequestDto } from './dto/recipe-comment-create-request.dto';
import { RecipeCommentUpdateRequestDto } from './dto/recipe-comment-update-request.dto';
import { RecipeCreateRequestDto } from './dto/recipe-create-request.dto';
import { RecipeUpdateRequestDto } from './dto/recipe-update-request.dto';
import { RecipeService } from './recipe.service';
import { MultiFileTypeValidator } from './validator/multi-file-type.validator';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('size', ParseIntPipe) size = 10,
    @Query('mode') mode = 'recent',
  ) {
    return this.recipeService.findAll(page, size, mode);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.recipeService.findOne(id);
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
