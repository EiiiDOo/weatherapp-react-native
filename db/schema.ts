import { WEATHER_DATA_TABLE_NAME } from "@/constants/keys";
import { SQLiteDatabase } from "expo-sqlite";

export const initializeDatabase = async (db: SQLiteDatabase): Promise<void> => {
  // Create tables
  const createItemsTable = `CREATE TABLE IF NOT EXISTS ${WEATHER_DATA_TABLE_NAME} (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT, isHome number, isFav number);`;

  try {
    await db.execAsync(createItemsTable);
  } catch (error) {
    console.error("Failed to initialize database schema:", error);
    throw error;
  }
};
