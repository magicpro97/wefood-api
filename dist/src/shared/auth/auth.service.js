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
const jsonwebtoken_1 = require("jsonwebtoken");
const user_service_1 = require("../../user/user.service");
const configuration_service_1 = require("../configuration/configuration.service");
const configuration_enum_1 = require("../configuration/configuration.enum");
let AuthService = class AuthService {
    constructor(userService, configurationService) {
        this.userService = userService;
        this.configurationService = configurationService;
        this.jwtOptions = { expiresIn: '12h' };
        this.jwtKey = this.configurationService.get(configuration_enum_1.Configuration.JWT_KEY);
    }
    signPayload(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.sign(payload, this.jwtKey, this.jwtOptions);
        });
    }
    validatePayload(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.findOne({ username: payload.username.toLowerCase() });
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        configuration_service_1.ConfigurationService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map