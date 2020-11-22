import { Product } from '../types';
import {
  SELECT_ALL_PRODUCTS,
  SELECT_PRODUCT,
  INSERT_PRODUCT,
  INSERT_STOCK, INSERT_PRODUCTS_BATCH,
} from './sql-queries'
import {messages} from "../utils";

export class DBClient {
  client: any;

  constructor(client) {
    this.client = client;
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

  async createProduct({title, description, price, count}: Product): Promise<Product> {
    try {
      await this.client.query('BEGIN');
      const { rows: productRows } = await this.client.query(INSERT_PRODUCT, [title, description, price]);
      const [newProduct] = productRows;
      const {id: productId} = newProduct;
      await this.client.query(INSERT_STOCK, [productId, count]);
      const { rows } = await this.client.query(SELECT_PRODUCT, [productId]);
      await this.client.query('COMMIT');
      return rows;
    } catch (err) {
      throw new Error(messages.failToCreateProduct(err));
    }
  }

  async createProducts(products: Product[]): Promise<Product[]> {
    try {
      await this.client.query('BEGIN');
      const result = await this.client.query(INSERT_PRODUCTS_BATCH(products));
      await this.client.query('COMMIT');
      return result;
    } catch (err) {
      throw new Error(messages.failToInsertProductsBatch(err));
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
