import { BASE_URL } from '@/constants';
import { Todo } from '@/types/todos';

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${BASE_URL}/todos`);
  if (!res.ok) {
    throw new Error('Failed to fetch todos');
  }
  return res.json();
};

export const getTodo = async (id: number): Promise<Todo> => {
  const res = await fetch(`${BASE_URL}/todos/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch todo');
  }
  return res.json();
};

export const createTodo = async (name: string) => {
  await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
};

export const updateTodo = async (params: {
  id: number;
  name: string;
  done: boolean;
}) => {
  await fetch(`${BASE_URL}/todos/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: params.name, done: params.done }),
  });
};

export const deleteTodo = async (id: number) => {
  await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
};
