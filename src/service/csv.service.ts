import { Injectable, Logger } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  /**
   * Saves data to a CSV file
   * @param data - Array of data objects to save
   * @param filename - Optional custom filename (without extension)
   * @param outputDir - Optional custom output directory (defaults to 'output')
   * @returns Path to the saved CSV file
   */
  async saveToCsv(
    data: any[],
    filename?: string,
    outputDir?: string,
  ): Promise<string> {
    if (data.length === 0) {
      this.logger.warn('No data to save to CSV');
      return null;
    }

    // Get all unique keys from all objects
    const headers = new Set<string>();
    data.forEach((row) => {
      Object.keys(row).forEach((key) => headers.add(key));
    });

    const headerArray = Array.from(headers);

    // Create CSV directory if it doesn't exist
    const dir = outputDir || path.join(process.cwd(), 'output');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate filename with timestamp if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const csvFilename = filename || `data-${timestamp}`;
    const filepath = path.join(dir, `${csvFilename}.csv`);

    const csvWriter = createObjectCsvWriter({
      path: filepath,
      header: headerArray.map((header) => ({ id: header, title: header })),
    });

    await csvWriter.writeRecords(data);
    this.logger.log(`Data saved to ${filepath}`);

    return filepath;
  }

  /**
   * Checks if a directory exists, creates it if it doesn't
   * @param dirPath - Path to the directory
   */
  ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
