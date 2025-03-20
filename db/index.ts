import getDatabase from "./database";
import { WeatherRepository } from "./repositories/weatherRepositories";
import { initializeDatabase } from "./schema";

// Initialize database and create repositories
const db = getDatabase();

// Initialize database
(async () => {
  try {
    await initializeDatabase(db);
  } catch (error) {
    console.error(
      "index fromm db folder Failed to initialize database:",
      error
    );
  }
})();

// Create repositories
export const weatherRepository = new WeatherRepository(db);

// Export everything needed
export { getDatabase, initializeDatabase };
