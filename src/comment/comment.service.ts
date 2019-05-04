import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Comment } from './models/comment.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { CommentParams } from './models/view-models/comment-params.model';

@Injectable()
export class CommentService extends BaseService<Comment> {
    constructor(
        @InjectModel(Comment.modelName)
        private readonly foodTagModel: ModelType<Comment>,
        private readonly mapperService: MapperService,
    ) {
        super();
        this.model = foodTagModel;
        this.mapper = mapperService.mapper;
    }

    async createComment(params: CommentParams): Promise<Comment> {
        const { userId, postId, content } = params;
        const newComment = new this.model();
        newComment.userId = userId;
        newComment.postId = postId;
        newComment.content = content;

        const result = await this.create(newComment);
        return result.toJSON() as Comment;
    }
}
