import mysql, { Pool, RowDataPacket } from "mysql2";

export class DB {
  private static __instance: DB;
  private pool: Pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
    multipleStatements: true,
  });
  //?
  private constructor() {}
  public static getInstance() {
    if (this.__instance == null) {
      return (this.__instance = new DB());
    }
    return this.__instance;
  }
  public _execute<T>(query: string, values?: any) {
    return new Promise<T[]>((resolve, reject) => {
      this.pool.execute<T[] & RowDataPacket[]>(
        query,
        values ?? [],
        (err, rows) => {
          if (err) {
            reject(err);
          }
          const row = rows;
          resolve(row);
        }
      );
    });
  }
  public _query<T>(query: string, values?: any) {
    return new Promise<T[]>((resolve, reject) => {
      this.pool.query<T[] & RowDataPacket[]>(
        query,
        values ?? [],
        (err, rows) => {
          if (err) {
            reject(err);
          }
          const row = rows;
          resolve(row);
        }
      );
    });
  }
}
