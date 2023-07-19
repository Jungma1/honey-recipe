import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { AuthUser } from '../auth/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RecipeCreateRequestDto } from './dto/recipe-create-request.dto';
import { RecipeUpdateRequestDto } from './dto/recipe-update-request.dto';
import { RecipeService } from './recipe.service';
import { MultiFileTypeValidator } from './validator/multi-file-type.validator';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.recipeService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @AuthUser() user: User,
    @Body() request: RecipeCreateRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new MultiFileTypeValidator({ fileTypes: ['jpg', 'jpeg', 'png'] }),
        ],
      }),
    )
    thumbnail: Express.Multer.File,
  ) {
    return this.recipeService.createRecipe(user, request, thumbnail);
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

  @Patch(':id/thumbnail')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateThumbnail(
    @Param('id') id: number,
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
    thumbnail: Express.Multer.File,
  ) {
    return this.recipeService.updateRecipeThumbnail(id, user, thumbnail);
  }
}
