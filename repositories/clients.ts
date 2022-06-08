import { Client } from "../db/db_client.ts";

interface ClientObject {
  clientId: string;
  hashedSecret: string;
  createdAt: string;
  updatedAt: string;
}

function isClient(rawArg: unknown): rawArg is ClientObject {
  if (!rawArg) return false;
  const arg = rawArg as { [key: string]: unknown };
  if (arg.clientId === undefined) return false;
  if (typeof arg.clientId !== "string") return false;
  if (arg.hashedSecret === undefined) return false;
  if (typeof arg.hashedSecret !== "string") return false;
  if (arg.createdAt === undefined) return false;
  if (typeof arg.createdAt !== "string") return false;
  if (arg.updatedAt === undefined) return false;
  if (typeof arg.updatedAt !== "string") return false;
  return true;
}

export async function tryGetClient(id: string): Promise<ClientObject> | never {
  const clients = await Client.where("client_id", id).get();
  if (!clients) throw new Error("clients is nullable!");
  if (!Array.isArray(clients)) throw new Error("clients is not array");
  if (clients.length !== 1) throw new Error("Not one is included in clients");
  const client = clients[0];

  if (!isClient(client)) throw new Error("Object is not Client");

  return client;
}

export async function tryExistClient(id: string): Promise<boolean> | never {
  const clients = await Client.where("client_id", id).first();

  return !!clients;
}

export async function tryInsertClient(
  clientId: string,
  hashedSecret: string,
): Promise<{ clientId: string; hashedSecret: string }> | never {
  const client = new Client();
  client.clientId = clientId;
  client.hashedSecret = hashedSecret;
  const r = await client.save();

  if (r.affectedRows !== 1) throw new Error("Client not save!");

  return { clientId, hashedSecret };
}
