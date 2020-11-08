import { Client } from 'pg';
import { DB_CONFIG } from './db.config';
import { Product } from '../types';
import { 
  SELECT_ALL_PRODUCTS,
  SELECT_PRODUCT,
} from './sql-queries'
import { messages } from '../utils';

export class DBClient {
  client: Client;

  constructor() {
    this.client = new Client(DB_CONFIG);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log(messages.successDbConnection);
    } catch (err) {
      throw new Error(messages.failDbConnection(err));
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const { rows } = await this.client.query(SELECT_ALL_PRODUCTS);
      return rows;
    } catch (err) {
      throw new Error(messages.failToQueryAllProduct(err));
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const { rows } = await this.client.query(SELECT_PRODUCT, [id]);
      return rows;
    } catch (err) {
      throw new Error(messages.failToQueryProduct(err));
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log(messages.successDbDisconnection);
    } catch (err) {
      throw new Error(messages.failDbDisconnection(err));
    }
  }
};
