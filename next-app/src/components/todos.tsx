'use client'

import Link from "next/link";
import {Todo} from "@/types/todos";
import { deleteTodoAction } from '@/actions';

export const Todos = ({ todos }: { todos: Todo[] }) => {
  const renderTodos = () => {
    return (
      <div className="relative">
        <ul>
          {(todos || []).map(({ id, name, done }) => (
            <li key={id} className="flex gap-3">
              <div>{id}</div>
              <div>{name}</div>
              <div>Done: {String(done)}</div>
              <div>
                <Link
                  href={`/todos/${id}/update`}
                  className="underline text-blue-500"
                >
                  Update
                </Link>
              </div>
              <div>
                <form action={deleteTodoAction}>
                  <input type="hidden" name="todo-id" value={id}/>
                  <button type="submit">Delete</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h1 className="flex gap-2">
        Todos{' '}
        <Link href="/todos/create" className="underline text-blue-500">
          Create
        </Link>
      </h1>
      {renderTodos()}
    </div>
  );
}