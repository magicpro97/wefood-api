import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { RegisterVm } from './models/view-models/register-response-vm.model';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginVm } from './models/view-models/login-vm.model';
import { AuthService } from '../shared/auth/auth.service';
import { JwtPayload } from '../shared/auth/jwt-payload';
import { UserVm } from './models/view-models/user-vm.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectModel(User.modelName)
        private readonly userModel: ModelType<User>,
        private readonly mapperService: MapperService,
        @Inject(forwardRef(() => AuthService))
        readonly authService: AuthService,
    ) {
        super();
        this.model = userModel;
        this.mapper = mapperService.mapper;
    }

    async register(registerVm: RegisterVm): Promise<User> {
        const {
            username,
            password,
            address,
            dob,
            email,
            firstName,
            lastName,
            sex,
            srcImage,
        } = registerVm;
        const newUser = new this.model();
        newUser.username = username;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.address = address;
        newUser.sex = sex;
        newUser.dob = dob;
        newUser.email = email;
        newUser.srcImage = srcImage;

        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);
        try {
            const result = await this.create(newUser);
            return result.toJSON() as User;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(loginVm: LoginVm): Promise<LoginResponseVm> {
        const { username, password } = loginVm;
        const user = await this.findOne({ username });

        if (!user) {
            throw new HttpException(
                'Invalid credentials',
                HttpStatus.BAD_REQUEST,
            );
        }
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            throw new HttpException(
                'Invalid credentials',
                HttpStatus.BAD_REQUEST,
            );
        }

        const payload: JwtPayload = {
            username: user.username,
            role: user.role,
        };
        const token = await this.authService.signPayload(payload);
        const userVm: UserVm = await this.map<UserVm>(user.toJSON());

        return {
            token,
            user: userVm,
        };
    }
}
