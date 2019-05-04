import {
    Controller,
    Post,
    HttpStatus,
    Body,
    HttpException,
    Delete,
    Param,
    Put,
    Get,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Comment } from './models/comment.model';
import { CommentService } from './comment.service';
import { CommentVm } from './models/view-models/comment-vm.model';
import { CommentParams } from './models/view-models/comment-params.model';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';

@Controller('comment')
@ApiUseTags(Comment.modelName)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @ApiResponse({ status: HttpStatus.CREATED, type: CommentVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Comment.modelName, 'Create'))
    async create(@Body() params: CommentParams): Promise<CommentVm> {
        const { userId, postId, content } = params;

        if (!userId) {
            throw new HttpException(
                'userId is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!postId) {
            throw new HttpException(
                'postId is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!content) {
            throw new HttpException(
                'content is required',
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const newComment = await this.commentService.createComment(params);
            return this.commentService.map<Comment>(newComment);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @ApiResponse({ status: HttpStatus.CREATED, type: CommentVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Comment.modelName, 'Update'))
    async update(@Body() params: CommentVm): Promise<CommentVm> {
        const { id, userId, postId, content } = params;
        try {
            if (!params || !id) {
                throw new HttpException(
                    'Missing parameters',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const exist = await this.commentService.findById(id);

            if (!exist) {
                throw new HttpException(
                    `${id} Not found`,
                    HttpStatus.NOT_FOUND,
                );
            }

            if (!userId) {
                throw new HttpException(
                    'userId is required',
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                exist.userId = userId;
            }

            if (!postId) {
                throw new HttpException(
                    'postId is required',
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                exist.postId = postId;
            }

            if (!content) {
                throw new HttpException(
                    'content is required',
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                if (content.trim().length > 0) {
                    exist.content = content;
                } else {
                    throw new HttpException(
                        'content is empty',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }
            const updated = await this.commentService.update(id, exist);
            return this.commentService.map<CommentVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK, type: CommentVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Comment.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<CommentVm> {
        try {
            const exist = await this.commentService.findById(id);
            if (exist) {
                const deleted = await this.commentService.delete(id);
                return this.commentService.map<CommentVm>(deleted.toJSON());
            } else {
                throw new HttpException(
                    `${id} is not exist`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: CommentVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(Comment.modelName, 'GetById'))
    async getById(@Param('id') id: string): Promise<CommentVm> {
        try {
            const exist = await this.commentService.findById(id);
            if (exist) {
                return this.commentService.map<CommentVm>(exist.toJSON());
            } else {
                throw new HttpException(
                    `${id} is not exists`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
