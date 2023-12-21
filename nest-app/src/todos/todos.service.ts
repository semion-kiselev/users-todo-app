import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseService } from '../database/database.service';
import { getSqlWithValuesForUpdate } from '../utils/sql';
import { CreateTodoPayload, Todo, UpdateTodoPayload } from './todos.types';

@Injectable()
export class TodosService {
  pool: Pool;

  constructor(private db: DatabaseService) {
    this.pool = this.db.getPool();
  }

  getTodos() {
    return this.pool
      .query<Todo>('SELECT id, name, done FROM todo')
      .then(({ rows }) => rows);
  }

  async getTodo(id: number) {
    const result = await this.pool.query(
      'SELECT id, name, done FROM todo WHERE id = $1',
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException();
    }

    return result.rows[0];
  }

  createTodo({ name }: CreateTodoPayload) {
    return this.pool
      .query('INSERT INTO todo (name) VALUES ($1) RETURNING *', [name])
      .then((result) => result.rows[0]);
  }

  async updateTodo(id: number, { name, done }: UpdateTodoPayload) {
    const [formattedSql, values] = getSqlWithValuesForUpdate(
      'UPDATE todo SET %s WHERE id = $1 RETURNING *',
      { name, done },
      [id],
    );

    const updateResult = await this.pool.query<Todo>(formattedSql, values);

    if (updateResult.rowCount === 0) {
      throw new NotFoundException();
    }

    return updateResult.rows[0];
  }

  async deleteTodo(id: number) {
    const result = await this.pool.query('DELETE FROM todo WHERE id = $1', [
      id,
    ]);

    if (result.rowCount === 0) {
      throw new NotFoundException();
    }

    return null;
  }
}
