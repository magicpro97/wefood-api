import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Put,
    Get,
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

    @Put()
    @ApiResponse({ status: HttpStatus.CREATED, type: UserVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiOperation(GetOperationId(User.modelName, 'Update'))
    async update(@Body() userVm: UpdateVm): Promise<UserVm> {
        const {
            id,
            firstName,
            address,
            articles,
            dob,
            email,
            followers,
            followings,
            foodTags,
            lastName,
            role,
            sex,
            srcImage,
        } = userVm;

        if (!userVm || !id) {
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
        this.handleArray(articles, exist, 'articles');
        this.handleArray(followers, exist, 'followers');
        this.handleArray(followings, exist, 'followings');
        this.handleArray(foodTags, exist, 'foodTags');
        try {
            const updatedUser = await this.userService.update(id, exist);
            return this.userService.map<UserVm>(updatedUser.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: UserVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: UserVm })
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

    handleArray(array: any[], obj: any, field: string): void {
        if (array !== undefined) {
            if (Array.isArray(array)) {
                if (obj[field] !== undefined) {
                    array.forEach(item => {
                        if (!array.includes(item)) {
                            obj[field].push(item);
                        }
                    });
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
