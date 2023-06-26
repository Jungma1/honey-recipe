import { Module } from '@nestjs/common';
import { FileService } from '~/common/file/file.service';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService, FileService],
})
export class RecipeModule {}
