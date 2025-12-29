import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SolarModule } from './solar/solar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SolarModule,
  ],
})
export class AppModule {}
