import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

// Define an interface for the error response from OpenWeatherMap
interface OpenWeatherMapErrorResponse {
  cod?: string | number;
  message?: string;
}

// Custom error class for weather-related errors
class WeatherApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = "WeatherApiError";
  }
}

// Configuration interface for weather API requests
interface WeatherApiConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
}

const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

class WeatherApi {
  private axiosInstance: AxiosInstance;
  private config: WeatherApiConfig;

  constructor(
    config: WeatherApiConfig = {
      baseURL: BASE_URL,
      timeout: 10000,
      retries: 3,
    }
  ) {
    if (!apiKey) {
      throw new Error("Weather API key is not defined");
    }

    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use((request) => {
      // console.log(
      //   `[WeatherApi] Sending request to: ${request.url}`,
      //   request.params
      // );
      return request;
    });

    // Add response interceptor for logging and error handling
    this.axiosInstance.interceptors.response.use((response) => {
      // console.log(`[WeatherApi] Received response:`, response.data);
      return response;
    }, this.handleError);
  }

  // Centralized error handling method
  private handleError = (error: AxiosError): never => {
    // Type guard to check if error.response exists and has data
    if (axios.isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as OpenWeatherMapErrorResponse;
      const statusCode = error.response.status;

      // Safely extract error message
      const errorMessage = errorResponse.message || `API Error: ${statusCode}`;

      console.error(`[WeatherApi] Error ${statusCode}:`, errorMessage);

      throw new WeatherApiError(errorMessage, statusCode, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("[WeatherApi] No response received:", error.request);
      throw new WeatherApiError("No response from weather service");
    } else {
      // Something happened in setting up the request
      console.error("[WeatherApi] Request setup error:", error.message);
      throw new WeatherApiError(error.message || "Unknown error occurred");
    }
  };

  // Retry mechanism for API calls
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retriesLeft: number = this.config.retries || 3
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retriesLeft > 0 && error instanceof WeatherApiError) {
        console.log(
          `[WeatherApi] Retrying request. Attempts left: ${retriesLeft}`
        );
        await this.delay(1000); // Wait 1 second before retrying
        return this.retryRequest(requestFn, retriesLeft - 1);
      }
      throw error;
    }
  }

  // Delay method for retry mechanism
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getWeatherEveryThreeHours(
    lat: number,
    lon: number,
    lang: string = "en",
    units: string = "metric"
  ): Promise<WeatherForecastFiveDays> {
    return this.retryRequest(() =>
      this.axiosInstance
        .get<WeatherForecastFiveDays>("forecast", {
          params: {
            lat,
            lon,
            lang,
            units,
            appid: apiKey,
          },
        })
        .then((response) => response.data)
    );
  }

  async getWeatherForLocation(
    lat: number,
    lon: number,
    lang: string = "en",
    units: string = "metric"
  ): Promise<WeatherData> {
    return this.retryRequest(() =>
      this.axiosInstance
        .get<WeatherData>("weather", {
          params: {
            lat,
            lon,
            lang,
            units,
            appid: apiKey,
          },
        })
        .then((response) => response.data)
    );
  }

  async getWeatherByCountryName(
    q: string,
    units: string = "metric"
  ): Promise<WeatherData> {
    return this.retryRequest(() =>
      this.axiosInstance
        .get<WeatherData>("weather", {
          params: {
            q,
            units,
            appid: apiKey,
          },
        })
        .then((response) => response.data)
    );
  }
}

// Export an instance of the WeatherApi class
const weatherApi = new WeatherApi();
export default weatherApi;
