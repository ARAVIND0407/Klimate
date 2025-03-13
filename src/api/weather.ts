import { API_CONFIG } from "./config";
import {
  Coordinates,
  ForecastData,
  GeocodingResponse,
  WeatherData,
} from "./types";

class WeatherAPI {
  private CreateURL(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    }).toString();
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async FetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    return response.json();
  }

  async GetCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.CreateURL(`${API_CONFIG.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    return this.FetchData<WeatherData>(url);
  }

  async GetForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.CreateURL(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    return this.FetchData<ForecastData>(url);
  }

  async ReverseGeocode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.CreateURL(`${API_CONFIG.GEO}/reverse`, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: "1",
    });
    return this.FetchData<GeocodingResponse[]>(url);
  }

  async SearchLocations(query: string): Promise<GeocodingResponse[]> {
    const url = this.CreateURL(`${API_CONFIG.GEO}/direct`, {
      q: query,
      limit: "5",
    });
    return this.FetchData<GeocodingResponse[]>(url);
  }
}

export const weatherAPI = new WeatherAPI();
