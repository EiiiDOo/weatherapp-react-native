import * as SQLite from "expo-sqlite";

// Define database connection
export const getDatabase = (): SQLite.SQLiteDatabase => {
  return SQLite.openDatabaseSync("myapp.db");
};

// Export for use in repositories
export default getDatabase;
