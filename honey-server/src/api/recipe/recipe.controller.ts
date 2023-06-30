import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from '../auth/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RecipeCourseUpdateDto } from './dto/recipe-course-update.dto';
import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeUpdateDto } from './dto/recipe-update.dto';
import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@AuthUser() user: User, @Body() request: RecipeCreateDto) {
    return this.recipeService.createRecipe(user, request);
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
}
