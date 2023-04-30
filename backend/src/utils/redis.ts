import {createClient, type RedisClientType} from "redis";

let client: RedisClientType | null = null;

if (process.env.REDIS_ENABLED !== "false") {
  client = createClient();
  
  client.on("error", (error: string) => {
    console.error(`redis client error: ${error}`);
  });

  await client.connect();
}


const redisGet = async (key: string): Promise<string | null> => {
  if (client === null) {
    return null;
  }
  return await client.get(key);
}

const redisSet = async (key: string, value: string): Promise<void> => {
  if (client === null) {
    return;
  }
  await client.set(key, value);
}

export {redisGet, redisSet};