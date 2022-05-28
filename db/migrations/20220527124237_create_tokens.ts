import {
  AbstractMigration,
  ClientSQLite,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientSQLite> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    await this.client.query(`
      CREATE TABLE tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT,
        hashed_token TEXT,
        expiration_at,
        created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
      );
      CREATE TRIGGER trigger_tokens_updated_at AFTER UPDATE ON test
      BEGIN
        UPDATE test SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
      END;
      `);
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    await this.client.query(`
      DROP TABLE tokens;
      DROP TRIGGER trigger_token_updated_at;
      `);
  }
}
