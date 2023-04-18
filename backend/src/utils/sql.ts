import mysql from "mysql";
import util from "util";

const connection = mysql.createConnection({
  host: process.env.AWS_DB_ENDPOINT,
  port: Number(process.env.AWS_DB_PORT),
  user: process.env.AWS_DB_USERNAME,
  password: process.env.AWS_DB_PASSWORD,
});

const sqlQuery = async (sql: string): Promise<unknown> => {
  return await util.promisify(connection.query).call(connection, sql);
};

await sqlQuery(`USE ${process.env.DB_NAME as string}`);

export { sqlQuery };
