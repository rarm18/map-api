# Map API

A NestJS-based API for fetching and processing solar data from Google Solar API.

## Features

- Fetch solar building insights data from Google Solar API
- Batch processing of multiple location parameters
- Automatic data flattening and CSV export
- Request validation and error handling

## Installation

```bash
pnpm install
```

## Configuration

Create a `.env` file in the root directory if needed for additional configuration.

## Running the API

```bash
# Development mode
pnpm start:dev

# Production mode
pnpm build
pnpm start:prod
```

The API will run on `http://localhost:3000` by default.

## API Endpoints

### POST /solar/buildingInsights

Fetches solar building insights data for specified locations and saves results as CSV.

**Request Body:**

```json
{
  "key": "YOUR_GOOGLE_MAP_API_KEY",
  "parameters": [
    {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "requiredQuality": "HIGH"
    }
  ]
}
```

**Parameters:**

- `key` (required): Google Solar API key
- `parameters` (required): Array of location parameters
  - `latitude` (required): Latitude coordinate
  - `longitude` (required): Longitude coordinate
  - `requiredQuality` (optional): Required data quality ("HIGH", "MEDIUM", or "LOW")

**Response:**
Returns flattened JSON array of solar data. Each response is also saved as CSV in the `output/` directory with a timestamp.

**Example:**

```bash
curl -X POST http://localhost:3000/solar/buildingInsights \
  -H "Content-Type: application/json" \
  -d '{
    "key": "YOUR_API_KEY",
    "parameters": [
      {
        "latitude": 37.7749,
        "longitude": -122.4194
      }
    ]
  }'
```

## Output

CSV files are automatically generated in the `output/` directory with filenames like:

```
solar-data-2025-12-28T10-30-45-123Z.csv
```

## Project Structure

```
src/
├── dto/
│   └── solar-request.dto.ts    # Request validation DTOs
├── service/
│   └── solar.service.ts        # Solar API integration and CSV export
├── app.controller.ts           # API endpoint controller
├── app.module.ts               # Application module
└── main.ts                     # Application entry point
```

## Dependencies

- `@nestjs/common`, `@nestjs/core` - NestJS framework
- `@nestjs/config` - Configuration management
- `axios` - HTTP client for API calls
- `class-validator`, `class-transformer` - DTO validation
- `csv-writer` - CSV file generation

## License

UNLICENSED
