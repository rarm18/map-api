import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { SolarParameterDto } from '../dto/solar-request.dto';

@Injectable()
export class SolarService {
  private readonly logger = new Logger(SolarService.name);
  private readonly BUILDING_INSIGHTS_API_URL =
    'https://solar.googleapis.com/v1/buildingInsights:findClosest';

  async processBuildingInsights(
    apiKey: string,
    parameters: SolarParameterDto[],
  ): Promise<any> {
    const allResults = [];

    for (const param of parameters) {
      try {
        const result = await this.fetchBuildingInsights(apiKey, param);
        const flattened = this.flattenObject(result, param);
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
    await this.saveToCsv(allResults);

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

  private flattenObject(obj: any, param: SolarParameterDto, prefix = ''): any {
    const flattened: any = {
      request_latitude: param.latitude,
      request_longitude: param.longitude,
    };

    const flatten = (current: any, path: string) => {
      if (current === null || current === undefined) {
        flattened[path] = null;
        return;
      }

      if (Array.isArray(current)) {
        flattened[path] = JSON.stringify(current);
        return;
      }

      if (typeof current === 'object' && !(current instanceof Date)) {
        for (const key in current) {
          const newPath = path ? `${path}_${key}` : key;
          flatten(current[key], newPath);
        }
      } else {
        flattened[path] = current;
      }
    };

    flatten(obj, prefix);
    return flattened;
  }

  private async saveToCsv(data: any[]): Promise<void> {
    if (data.length === 0) {
      this.logger.warn('No data to save to CSV');
      return;
    }

    // Get all unique keys from all objects
    const headers = new Set<string>();
    data.forEach((row) => {
      Object.keys(row).forEach((key) => headers.add(key));
    });

    const headerArray = Array.from(headers);

    // Create CSV directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(outputDir, `building-insights-${timestamp}.csv`);

    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: headerArray.map((header) => ({ id: header, title: header })),
    });

    await csvWriter.writeRecords(data);
    this.logger.log(`Building insights data saved to ${filename}`);
  }
}
