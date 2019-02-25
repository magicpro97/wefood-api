"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const configuration_service_1 = require("./configuration/configuration.service");
const mapper_service_1 = require("./mapper/mapper.service");
const auth_service_1 = require("./auth/auth.service");
const jwt_strategy_service_1 = require("./auth/strategies/jwt-strategy.service");
const user_module_1 = require("../user/user.module");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    common_1.Global(),
    common_1.Module({
        providers: [configuration_service_1.ConfigurationService, mapper_service_1.MapperService, auth_service_1.AuthService, jwt_strategy_service_1.JwtStrategyService],
        exports: [configuration_service_1.ConfigurationService, mapper_service_1.MapperService, auth_service_1.AuthService],
        imports: [user_module_1.UserModule],
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map