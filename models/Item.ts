export interface Item {
  id?: number;
  text: string;
  completed: boolean;
}

// For database operations
export interface ItemDTO {
  id?: number;
  text: string;
  completed: number; // SQLite doesn't have boolean, so we use 0/1
}
