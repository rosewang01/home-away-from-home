import { createClient } from "redis";

const client = createClient();

client.on("error", (error: string) => {
  console.error(`redis client error: ${error}`);
});

await client.connect();

const redisGet = async (key: string): Promise<string | null> => {
  return await client.get(key);
}

const redisSet = async (key: string, value: string): Promise<void> => {
  await client.set(key, value);
}

export {redisGet, redisSet};