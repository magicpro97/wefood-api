import {
    Controller,
    Post,
    HttpStatus,
    Get,
    Put,
    Delete,
    Param,
    Body,
    HttpException,
    UseInterceptors,
    FileInterceptor,
    UploadedFile,
    Req,
    Res,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { FoodTag } from './models/food-tag.model';
import { FoodTagService } from './food-tag.service';
import { map } from 'lodash';
import { FoodTagVm } from './models/view-models/food-tag-vm.model';
import { FoodTagParams } from './models/view-models/food-tag-params.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { multerOptions } from '../shared/multerOptions';
import { ApiException } from '../shared/api-exception.model';

@Controller('food-tag')
@ApiUseTags(FoodTag.modelName)
export class FoodTagController {
    constructor(private readonly foodTagService: FoodTagService) {}

    @Get('images/:name')
    async downloadImage(@Param('name') name: string, @Res() res): Promise<any> {
        res.sendFile(name, { root: 'images' });
    }

    @Post('upload-image')
    @ApiResponse({ status: HttpStatus.CREATED, type: FoodTagVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async updateImage(
        @UploadedFile() file: any,
        @Req() req,
    ): Promise<FoodTagVm> {
        if (file) {
            const exist = await this.foodTagService.findOne({
                tagName: file.originalname.split('.')[0],
            });
            if (exist) {
                exist.srcImage = `food-tag/images/${file.filename}`;
                return this.foodTagService.update(exist.id, exist);
            } else {
                throw new HttpException(
                    `${file.originalname} is not exist`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } else {
            throw new HttpException(`file required`, HttpStatus.BAD_REQUEST);
        }
    }

    @Post()
    @ApiResponse({ status: HttpStatus.CREATED, type: FoodTagVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodTag.modelName, 'Create'))
    async create(@Body() params: FoodTagParams): Promise<FoodTagVm> {
        const { tagName } = params;

        if (!tagName) {
            throw new HttpException(
                'Content is required',
                HttpStatus.BAD_REQUEST,
            );
        }
        let exist;
        try {
            exist = await this.foodTagService.findOne({ tagName });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (exist) {
            throw new HttpException(
                `${tagName} exists`,
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const newFoodTag = await this.foodTagService.createFoodTag(params);
            return this.foodTagService.map<FoodTag>(newFoodTag);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: FoodTagVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodTag.modelName, 'GetAll'))
    async get(): Promise<FoodTagVm[]> {
        try {
            const foodTags = await this.foodTagService.findAll();
            return this.foodTagService.map<FoodTagVm[]>(
                map(foodTags, foodTag => foodTag.toJSON()),
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @ApiResponse({ status: HttpStatus.CREATED, type: FoodTagVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodTag.modelName, 'Update'))
    async update(@Body() vm: FoodTagVm): Promise<FoodTagVm> {
        const { id, tagName } = vm;

        if (!vm || !id) {
            throw new HttpException(
                'Missing parameters',
                HttpStatus.BAD_REQUEST,
            );
        }

        const exist = await this.foodTagService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        exist.tagName = tagName;

        try {
            const updated = await this.foodTagService.update(id, exist);
            return this.foodTagService.map<FoodTagVm>(updated.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK, type: FoodTagVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(FoodTag.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<FoodTagVm> {
        try {
            const exist = await this.foodTagService.findById(id);
            if (exist && exist.srcImage) {
                this.foodTagService.deleteImageFile(exist.srcImage);
                const deleted = await this.foodTagService.delete(id);
                return this.foodTagService.map<FoodTagVm>(deleted.toJSON());
            } else {
                throw new HttpException(
                    'Image is not exist',
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
