import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Put,
    Get,
    Query,
    Param,
} from '@nestjs/common';
import { User } from './models/user.model';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterVm } from './models/view-models/register-response-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { UpdateVm } from './models/view-models/update-vm.model';
import { map, isArray } from 'lodash';

@Controller('user')
@ApiUseTags(User.modelName)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put(':userId/follow/:followeeId')
    @ApiResponse({ status: HttpStatus.CREATED, type: UserVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'Follow'))
    async follow(
        @Param('userId') userId: string,
        @Param('followeeId') followeeId: string,
    ): Promise<UserVm> {
        const existUser = await this.userService.findById(userId);
        if (!existUser) {
            throw new HttpException(
                `${followeeId} is not exist`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const existFollowee = await this.userService.findById(followeeId);
        if (!existFollowee) {
            throw new HttpException(
                `${followeeId} is not exist`,
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!existUser.followings) {
            existUser.followings = [];
        }

        if (existUser.followings.indexOf(existFollowee.id) !== -1) {
            throw new HttpException(
                `${existFollowee.id} have been followed`,
                HttpStatus.BAD_REQUEST,
            );
        } else {
            existUser.followings.push(existFollowee.id);
        }

        if (!existFollowee.followers) {
            existFollowee.followers = [];
        }

        if (existFollowee.followers.indexOf(existUser.id) !== -1) {
            throw new HttpException(
                `${existUser.id} have been follower`,
                HttpStatus.BAD_REQUEST,
            );
        } else {
            existFollowee.followers.push(existUser.id);
        }
        await this.userService.update(existFollowee.id, existFollowee);
        const updatedUser = await this.userService.update(userId, existUser);
        return this.userService.map<UserVm>(updatedUser.toJSON());
    }

    @Put(':userId/unfollow/:followeeId')
    @ApiResponse({ status: HttpStatus.CREATED, type: UserVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'UnFollow'))
    async unFollow(
        @Param('userId') userId: string,
        @Param('followeeId') followeeId: string,
    ): Promise<UserVm> {
        const existUser = await this.userService.findById(userId);
        if (!existUser) {
            throw new HttpException(
                `${followeeId} is not exist`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const existFollowee = await this.userService.findById(followeeId);
        if (!existFollowee) {
            throw new HttpException(
                `${followeeId} is not exist`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const indexFolloweeId = existUser.followings.indexOf(existFollowee.id);
        if (indexFolloweeId === -1) {
            throw new HttpException(
                `${userId} did not follow ${followeeId}`,
                HttpStatus.BAD_REQUEST,
            );
        } else {
            for (let i = 0; i < existUser.followings.length; i++) {
                if (existUser.followings[i] === existFollowee.id) {
                    existUser.followings.splice(i, 1);
                    i--;
                }
            }
        }

        const indexFollowerId = existFollowee.followers.indexOf(existUser.id);
        if (indexFollowerId === -1) {
            throw new HttpException(
                `${userId} did not follow ${followeeId}`,
                HttpStatus.BAD_REQUEST,
            );
        } else {
            for (let i = 0; i < existFollowee.followers.length; i++) {
                if (existFollowee.followers[i] === existUser.id) {
                    existFollowee.followers.splice(i, 1);
                    i--;
                }
            }
        }

        await this.userService.update(existFollowee.id, existFollowee);
        const updatedUser = await this.userService.update(userId, existUser);
        return this.userService.map<UserVm>(updatedUser.toJSON());
    }

    @Put()
    @ApiResponse({ status: HttpStatus.OK, type: UserVm })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'Update'))
    async update(
        @Body() updateVm: UpdateVm,
        @Query('renew') renew?: string,
    ): Promise<UserVm> {
        const {
            id,
            firstName,
            address,
            foodPost,
            dob,
            email,
            followers,
            followings,
            foodTags,
            lastName,
            role,
            sex,
            srcImage,
        } = updateVm;

        if (!updateVm || !id) {
            throw new HttpException(
                'Missing parameter',
                HttpStatus.BAD_REQUEST,
            );
        }

        const exist = await this.userService.findById(id);
        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }
        exist.firstName = firstName !== undefined ? firstName : exist.firstName;
        exist.address = address !== undefined ? address : exist.address;
        exist.dob = dob !== undefined ? dob : exist.dob;
        exist.email = email !== undefined ? email : exist.email;
        exist.role = role !== undefined ? role : exist.role;
        exist.sex = sex !== undefined ? sex : exist.sex;
        exist.lastName = lastName !== undefined ? lastName : exist.lastName;
        exist.srcImage = srcImage !== undefined ? srcImage : exist.srcImage;
        this.handleArray(foodPost, exist, 'foodPost', renew);
        this.handleArray(followers, exist, 'followers', renew);
        this.handleArray(followings, exist, 'followings', renew);
        this.handleArray(foodTags, exist, 'foodTags', renew);
        try {
            const updatedUser = await this.userService.update(id, exist);
            return this.userService.map<UserVm>(updatedUser.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: UserVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiOperation(GetOperationId(User.modelName, 'GetAll'))
    async get(): Promise<UserVm[]> {
        try {
            const users = await this.userService.findAll();
            return this.userService.map<UserVm[]>(
                map(users, user => user.toJSON()),
            );
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id/followers')
    @ApiResponse({ status: HttpStatus.OK, type: UserVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'getAllFollowers'))
    async getAllFollowers(@Param('id') id: string): Promise<UserVm[]> {
        try {
            const existUser = await this.userService.findById(id);
            if (!existUser) {
                throw new HttpException(
                    `${id} is not exist`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            const followers: UserVm[] = [];
            if (existUser.followers) {
                for (const follower of existUser.followers) {
                    followers.push(await this.userService.findById(follower));
                }
            }
            return followers;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id/followees')
    @ApiResponse({ status: HttpStatus.OK, type: UserVm, isArray: true })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: ApiException,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'getAllFollowees'))
    async getAllFollowees(@Param('id') id: string): Promise<UserVm[]> {
        try {
            const existUser = await this.userService.findById(id);
            if (!existUser) {
                throw new HttpException(
                    `${id} is not exist`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            const followees: UserVm[] = [];
            if (existUser.followings) {
                for (const followee of existUser.followings) {
                    followees.push(await this.userService.findById(followee));
                }
            }
            return followees;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: UserVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: UserVm })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: UserVm })
    async getById(@Param('id') id: string): Promise<UserVm> {
        try {
            const user = await this.userService.findById(id);
            return this.userService.map<UserVm>(user.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('register')
    @ApiResponse({ status: HttpStatus.CREATED, type: UserVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'Register'))
    async register(@Body() registerVm: RegisterVm): Promise<UserVm> {
        const { username, password } = registerVm;
        if (!username) {
            throw new HttpException(
                'Username is required',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (!password) {
            throw new HttpException(
                'Password is required',
                HttpStatus.BAD_REQUEST,
            );
        }
        let exist;
        try {
            exist = await this.userService.findOne({ username });
        } catch (e) {
            throw new HttpException(e, HttpStatus.NOT_FOUND);
        }
        if (exist) {
            throw new HttpException(
                `${username} exists`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const newUser = await this.userService.register(registerVm);
        return this.userService.map<UserVm>(newUser);
    }

    @Post('login')
    @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'Login'))
    async login(@Body() loginVm: LoginVm): Promise<LoginResponseVm> {
        const fields = Object.keys(loginVm);
        fields.forEach(field => {
            if (!loginVm[field]) {
                throw new HttpException(
                    `${field} is required`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        });

        return this.userService.login(loginVm);
    }

    handleArray(array: any[], obj: any, field: string, renew: string): void {
        if (array) {
            if (Array.isArray(array)) {
                if (obj[field]) {
                    if (renew === 'false') {
                        array.forEach(item => {
                            if (!obj[field].includes(item)) {
                                obj[field].push(item);
                            }
                        });
                    } else {
                        obj[field] = array;
                    }
                } else {
                    obj[field] = array;
                }
            } else {
                throw new HttpException(
                    `${array} should be a array of ${field} id`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
    }
}
