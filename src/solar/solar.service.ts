import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { SolarParameterDto } from '../dto/solar-request.dto';
import { FlattenService } from '../service/flatten.service';
import { CsvService } from '../service/csv.service';

@Injectable()
export class SolarService {
  private readonly logger = new Logger(SolarService.name);
  private readonly BUILDING_INSIGHTS_API_URL =
    'https://solar.googleapis.com/v1/buildingInsights:findClosest';

  constructor(
    private readonly flattenService: FlattenService,
    private readonly csvService: CsvService,
  ) {}

  async processBuildingInsights(
    apiKey: string,
    parameters: SolarParameterDto[],
  ): Promise<any> {
    const allResults = [];

    for (const param of parameters) {
      try {
        const result = await this.fetchBuildingInsights(apiKey, param);
        const flattened = this.flattenService.flattenObject(result, {
          request_latitude: param.latitude,
          request_longitude: param.longitude,
        });
        allResults.push(flattened);
      } catch (error) {
        this.logger.error(
          `Error fetching building insights for lat: ${param.latitude}, lng: ${param.longitude}`,
          error.message,
        );
        allResults.push({
          latitude: param.latitude,
          longitude: param.longitude,
          error: error.message,
        });
      }
    }

    // Save to CSV
    await this.csvService.saveToCsv(allResults, 'building-insights');

    return allResults;
  }

  private async fetchBuildingInsights(
    apiKey: string,
    param: SolarParameterDto,
  ): Promise<any> {
    const queryParams: any = {
      'location.latitude': param.latitude.toString(),
      'location.longitude': param.longitude.toString(),
    };

    if (param.requiredQuality) {
      queryParams.requiredQuality = param.requiredQuality;
    }

    queryParams.key = apiKey;

    this.logger.debug(
      `Fetching building insights with params: ${JSON.stringify(queryParams)}`,
    );

    const response = await axios.get(this.BUILDING_INSIGHTS_API_URL, {
      params: queryParams,
    });

    return response.data;
  }
}
