import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SolarService } from './solar.service';
import { SolarRequestDto } from '../dto/solar-request.dto';

@Controller('solar')
export class SolarController {
  constructor(private readonly solarService: SolarService) {}

  @Post('buildingInsights')
  @UsePipes(new ValidationPipe({ transform: true }))
  async buildingInsights(@Body() body: SolarRequestDto): Promise<any> {
    return await this.solarService.processBuildingInsights(
      body.key,
      body.parameters,
    );
  }
}
