import { Client } from 'pg';
import { ENV } from '../../config/env/env';

export class DBClient {

  async query(sql:string){

    const client = new Client({
      connectionString: ENV.DB_URL
    });

    await client.connect();
    const res = await client.query(sql);
    await client.end();

    return res.rows;
  }
}