"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const user_model_1 = require("./models/user.model");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const register_response_vm_model_1 = require("./models/view-models/register-response-vm.model");
const user_vm_model_1 = require("./models/view-models/user-vm.model");
const api_exception_model_1 = require("../shared/api-exception.model");
const get_operation_id_1 = require("../shared/utilities/get-operation-id");
const login_response_vm_model_1 = require("./models/view-models/login-response-vm.model");
const login_vm_model_1 = require("./models/view-models/login-vm.model");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    register(registerVm) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = registerVm;
            if (!username) {
                throw new common_1.HttpException('Username is required', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!password) {
                throw new common_1.HttpException('Password is required', common_1.HttpStatus.BAD_REQUEST);
            }
            let exist;
            try {
                exist = yield this.userService.findOne({ username });
            }
            catch (e) {
                throw new common_1.HttpException(e, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (exist) {
                throw new common_1.HttpException(`${username} exists`, common_1.HttpStatus.BAD_REQUEST);
            }
            const newUser = yield this.userService.register(registerVm);
            return this.userService.map(newUser);
        });
    }
    login(loginVm) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(loginVm);
            fields.forEach(field => {
                if (!loginVm[field]) {
                    throw new common_1.HttpException(`${field} is required`, common_1.HttpStatus.BAD_REQUEST);
                }
            });
            return this.userService.login(loginVm);
        });
    }
};
__decorate([
    common_1.Post('register'),
    swagger_1.ApiResponse({ status: common_1.HttpStatus.CREATED, type: user_vm_model_1.UserVm }),
    swagger_1.ApiResponse({ status: common_1.HttpStatus.BAD_REQUEST, type: api_exception_model_1.ApiException }),
    swagger_1.ApiOperation(get_operation_id_1.GetOperationId(user_model_1.User.modelName, 'Register')),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_response_vm_model_1.RegisterVm]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    common_1.Post('login'),
    swagger_1.ApiResponse({ status: common_1.HttpStatus.CREATED, type: login_response_vm_model_1.LoginResponseVm }),
    swagger_1.ApiResponse({ status: common_1.HttpStatus.BAD_REQUEST, type: api_exception_model_1.ApiException }),
    swagger_1.ApiOperation(get_operation_id_1.GetOperationId(user_model_1.User.modelName, 'Login')),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_vm_model_1.LoginVm]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
UserController = __decorate([
    common_1.Controller('user'),
    swagger_1.ApiUseTags(user_model_1.User.modelName),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map