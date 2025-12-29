import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SolarService } from './solar.service';
import { SolarController } from './solar.controller';
import { FlattenService } from 'src/service/flatten.service';
import { CsvService } from 'src/service/csv.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [SolarController],
  providers: [SolarService, CsvService, FlattenService],
})
export class SolarModule {}
