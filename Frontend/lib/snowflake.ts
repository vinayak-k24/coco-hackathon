import snowflake from 'snowflake-sdk';

let connection: snowflake.Connection | null = null;
let connectPromise: Promise<snowflake.Connection> | null = null;

function getConnection(): Promise<snowflake.Connection> {
  if (connection) return Promise.resolve(connection);
  if (connectPromise) return connectPromise;

  connectPromise = new Promise((resolve, reject) => {
    const conn = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT!,
      username: process.env.SNOWFLAKE_USER!,
      password: process.env.SNOWFLAKE_PASSWORD!,
      database: process.env.SNOWFLAKE_DATABASE || 'PDM',
      warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'COMPUTE_WH',
      schema: 'CORE',
    });

    conn.connect((err) => {
      if (err) {
        connectPromise = null;
        reject(err);
      } else {
        connection = conn;
        resolve(conn);
      }
    });
  });

  return connectPromise;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  binds: snowflake.Binds = [],
): Promise<T[]> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) reject(err);
        else resolve((rows || []) as T[]);
      },
    });
  });
}
