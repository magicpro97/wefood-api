import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { FoodTagModule } from '../food-tag/food-tag.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.modelName, schema: User.model.schema },
        ]),
        FoodTagModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
