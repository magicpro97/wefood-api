"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const configuration_enum_1 = require("./configuration.enum");
const config_1 = require("config");
let ConfigurationService = class ConfigurationService {
    constructor() {
        this.environmentHosting = process.env.NODE_ENV || 'development';
    }
    get isDevelopment() {
        return this.environmentHosting === 'development';
    }
    get(name) {
        return process.env[name] || config_1.get(name);
    }
};
ConfigurationService.connectionString = process.env[configuration_enum_1.Configuration.MONG_URI] || config_1.get(configuration_enum_1.Configuration.MONG_URI);
ConfigurationService = __decorate([
    common_1.Injectable()
], ConfigurationService);
exports.ConfigurationService = ConfigurationService;
//# sourceMappingURL=configuration.service.js.map