import { createClient } from "redis";

const client = createClient();

if (process.env.REDIS_ENABLED !== "false") {
  client.on("error", (error: string) => {
    console.error(`redis client error: ${error}`);
  });

  await client.connect();
}


const redisGet = async (key: string): Promise<string | null> => {
  if (process.env.REDIS_ENABLED === "false") {
    return null;
  }
  return await client.get(key);
}

const redisSet = async (key: string, value: string): Promise<void> => {
  if (process.env.REDIS_ENABLED === "false") {
    return;
  }
  await client.set(key, value);
}

export {redisGet, redisSet};