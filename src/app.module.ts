import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SolarService } from './service/solar.service';
import { FlattenService } from './service/flatten.service';
import { CsvService } from './service/csv.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [SolarService, FlattenService, CsvService],
})
export class AppModule {}
