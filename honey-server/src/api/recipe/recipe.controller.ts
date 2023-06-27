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
  async update(@Param('id') id: number, @Body() request: RecipeUpdateDto) {
    return this.recipeService.updateRecipe(id, request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {
    return this.recipeService.deleteRecipe(id);
  }

  @Post(':id/course')
  @UseGuards(JwtAuthGuard)
  async addCourse(@Param('id') id: number) {
    return this.recipeService.addCourse(id);
  }
}
