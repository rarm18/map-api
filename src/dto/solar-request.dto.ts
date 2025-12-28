import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ImageryQuality {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class SolarParameterDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  @IsEnum(ImageryQuality)
  requiredQuality?: string;
}

export class SolarRequestDto {
  @IsString()
  key: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SolarParameterDto)
  parameters: SolarParameterDto[];
}
