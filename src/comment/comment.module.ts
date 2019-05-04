import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment } from './models/comment.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Comment.modelName, schema: Comment.model.schema },
        ]),
    ],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
