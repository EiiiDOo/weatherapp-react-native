import { WEATHER_DATA_TABLE_NAME } from "@/constants/keys";
import { SQLiteDatabase } from "expo-sqlite";

export interface CustomSaveDTOWithId extends CustomSaveDTO {
  id: number;
}
interface WeatherDataRow {
  id: number;
  data: string; // This will be the JSON string representation of CustomSaveDTO
  isHome: number; // Store as number (0 or 1)
  isFav: number; // Store as number (0 or 1)
}

export class WeatherRepository {
  private db: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.db = database;
  }

  // Create
  async addWeatherDataHome(data: string): Promise<number> {
    try {
      // Check if there is existing home weather data
      const existingHomeData = await this.db.getFirstAsync<{ id: number }>(
        `SELECT id FROM ${WEATHER_DATA_TABLE_NAME} WHERE isHome = true`
      );

      // If there is existing home data, delete it
      if (existingHomeData) {
        await this.db.execAsync(
          `DELETE FROM ${WEATHER_DATA_TABLE_NAME} WHERE id = ${existingHomeData.id}`
        );
      }

      // Insert the new home weather data
      await this.db.execAsync(
        `INSERT INTO ${WEATHER_DATA_TABLE_NAME} (data, isHome, isFav) VALUES ('${data}', true, false)`
      );

      // Get the last inserted ID
      const result = await this.db.getFirstAsync<{ id: number }>(
        `SELECT last_insert_rowid() as id`
      );
      return result?.id || -1;
    } catch (error) {
      console.error(
        "WeatherRepository",
        "Error adding addWeatherDataHome:",
        error
      );
      throw error;
    }
  }
  // Create
  async addWeatherDataFav(data: string): Promise<number> {
    try {
      await this.db.execAsync(
        `INSERT INTO ${WEATHER_DATA_TABLE_NAME} (data, isHome, isFav) VALUES ('${data}', false, true)`
      );

      // Get the last inserted ID
      const result = await this.db.getFirstAsync<{ id: number }>(
        `SELECT last_insert_rowid() as id`
      );
      return result?.id || -1;
    } catch (error) {
      console.error(
        "WeatherRepository",
        "Error adding addWeatherDataFav:",
        error
      );
      throw error;
    }
  }

  // Read all fav
  async getFavorites(): Promise<CustomSaveDTOWithId[]> {
    try {
      const result = await this.db.getAllAsync<WeatherDataRow>(
        `SELECT * FROM ${WEATHER_DATA_TABLE_NAME} WHERE isFav = 1`
      );
      // Check if result is empty
      if (result.length === 0) {
        return []; // or throw an error, or return a default value
      }

      // Convert database rows to CustomSaveDTO objects
      return result.map((row) => {
        const data = JSON.parse(row.data);
        return {
          ...data,
          id: row.id,
        };
      });
    } catch (error) {
      console.error("Error getFavorites:", error);
      throw error;
    }
  }

  async getAllWeather(): Promise<CustomSaveDTOWithId[]> {
    try {
      const result = await this.db.getAllAsync<WeatherDataRow>(
        `SELECT * FROM ${WEATHER_DATA_TABLE_NAME}`
      );
      // Check if result is empty
      if (result.length === 0) {
        return []; // or throw an error, or return a default value
      }

      // Convert database rows to CustomSaveDTO objects
      return result.map((row) => {
        const data = JSON.parse(row.data);
        return {
          ...data,
          id: row.id,
        };
      });
    } catch (error) {
      console.error("Error getAllWeather :", error);
      throw error;
    }
  }

  async getHomeData(): Promise<CustomSaveDTO | null> {
    try {
      const result = await this.db.getAllAsync<WeatherDataRow>(
        `SELECT * FROM ${WEATHER_DATA_TABLE_NAME} WHERE isHome = 1 LIMIT 1`
      );
      // Check if result is empty
      if (result.length === 0) {
        return null; // or throw an error, or return a default value
      }
      // Convert database rows to CustomSaveDTO objects
      return JSON.parse(result[0].data);
    } catch (error) {
      console.error("Error getting Home Data:", error);
      throw error;
    }
  }

  // Delete
  async deleteWeather(id: number): Promise<boolean> {
    try {
      // First check if the item exists
      const weatherDataRow = await this.db.getFirstAsync<WeatherDataRow>(
        `SELECT * FROM ${WEATHER_DATA_TABLE_NAME} WHERE id = ${id}`
      );
      if (!weatherDataRow) return false;

      await this.db.execAsync(
        `DELETE FROM ${WEATHER_DATA_TABLE_NAME} WHERE id = ${id}`
      );
      return true;
    } catch (error) {
      console.error("Error  deleteWeather:", error);
      throw error;
    }
  }
  //get One Weather
  async getWeatherForDetails(id: number): Promise<CustomSaveDTOWithId> {
    try {
      // First check if the item exists
      const weatherDataRow = await this.db.getFirstAsync<WeatherDataRow>(
        `SELECT data FROM ${WEATHER_DATA_TABLE_NAME} WHERE id = ${id}`
      );
      if (!weatherDataRow) throw Error("Not Found This id" + id);

      return JSON.parse(weatherDataRow.data);
    } catch (error) {
      console.error("Error getWeatherForDetails item:", error);
      throw error;
    }
  }

  // Delete
  async deleteAll(): Promise<boolean> {
    try {
      await this.db.execAsync(`DELETE FROM ${WEATHER_DATA_TABLE_NAME}`);
      return true;
    } catch (error) {
      console.error("Error deleteAll weather:", error);
      throw error;
    }
  }
}
