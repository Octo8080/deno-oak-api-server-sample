import { config } from "../config/config.ts";
import { Database, DataTypes, Model, SQLite3Connector } from "../deps.ts";

const connector = new SQLite3Connector({
  filepath: `./db/${config.dataBaseFile}`,
});
class Token extends Model {
  static table = "tokens";

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    clientId: DataTypes.STRING,
    hashedToken: DataTypes.STRING,
    expirationAt: DataTypes.STRING,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  };
}

class Client extends Model {
  static table = "clients";

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    clientId: DataTypes.STRING,
    hashedSecret: DataTypes.STRING,
    expirationAt: DataTypes.STRING,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  };
}

class Post extends Model {
  static table = "posts";

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    clientId: DataTypes.STRING,
    text: DataTypes.STRING,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  };
}

const db = new Database(connector);
db.link([Token, Client, Post]);

function getDbClient(): Database {
  return db;
}
async function doClose() {
  await db.close();
}
export { Client, doClose, getDbClient, Token, Post };
