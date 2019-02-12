import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';

@Module({
  providers: [ConfigurationService, MapperService],
  exports: [ConfigurationService, MapperService],
})
export class SharedModule {}
