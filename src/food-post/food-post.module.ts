import { Module, forwardRef } from '@nestjs/common';
import { FoodPostController } from './food-post.controller';
import { FoodPostService } from './food-post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodPost } from './models/food-post.model';
import { FoodTagModule } from '../food-tag/food-tag.module';
import { StepModule } from '../step/step.module';
import { IngredientModule } from '../ingredient/ingredient.module';
import { IngredientDetailModule } from '../ingredient-detail/ingredient-detail.module';
import { UnitModule } from '../unit/unit.module';
import { UserModule } from '../user/user.module';
import { CommentModule } from '../comment/comment.module';
import { RatingModule } from '../rating/rating.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FoodPost.modelName, schema: FoodPost.model.schema },
        ]),
        CommentModule,
        FoodTagModule,
        StepModule,
        IngredientModule,
        IngredientDetailModule,
        UnitModule,
        UserModule,
        forwardRef(() => RatingModule),
    ],
    controllers: [FoodPostController],
    providers: [FoodPostService],
    exports: [FoodPostService],
})
export class FoodPostModule {}
