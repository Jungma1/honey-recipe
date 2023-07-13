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
import { RecipeCourseUpdateDto } from './dto/recipe-course-update.dto';
import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeUpdateDto } from './dto/recipe-update.dto';
import { RecipeService } from './recipe.service';
import { MultiFileTypeValidator } from './validator/multi-file-type.validator';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @AuthUser() user: User,
    @Body() request: RecipeCreateDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
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
    @Body() request: RecipeUpdateDto,
  ) {
    return this.recipeService.updateRecipe(id, user, request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number, @AuthUser() user: User) {
    return this.recipeService.deleteRecipe(id, user);
  }

  @Post(':id/course')
  @UseGuards(JwtAuthGuard)
  async addCourse(@Param('id') id: number, @AuthUser() user: User) {
    return this.recipeService.addCourse(id, user);
  }

  @Patch(':id/course/:courseId')
  @UseGuards(JwtAuthGuard)
  async updateCourse(
    @Param('id') id: number,
    @Param('courseId') courseId: number,
    @AuthUser() user: User,
    @Body() request: RecipeCourseUpdateDto,
  ) {
    return this.recipeService.updateCourse(id, courseId, user, request);
  }

  @Delete(':id/course/:courseId')
  @UseGuards(JwtAuthGuard)
  async deleteCourse(
    @Param('id') id: number,
    @Param('courseId') courseId: number,
    @AuthUser() user: User,
  ) {
    return this.recipeService.deleteCourse(id, courseId, user);
  }

  @Patch(':id/course/:courseId/order/:targetId')
  @UseGuards(JwtAuthGuard)
  async updateCourseOrder(
    @Param('id') id: number,
    @Param('courseId') courseId: number,
    @Param('targetId') targetId: number,
    @AuthUser() user: User,
  ) {
    return this.recipeService.updateCourseOrder(id, courseId, targetId, user);
  }

  @Get('types')
  async getRecipeTypes() {
    return this.recipeService.getRecipeTypes();
  }
}
