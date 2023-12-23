import { BASE_URL } from '@/constants';
import { Todo } from '@/types/todos';

const sleep = (time: number = 2000) =>
  new Promise((res) => setTimeout(res, time));

export const getTodos = async (): Promise<Todo[]> => {
  await sleep();
  const res = await fetch(`${BASE_URL}/todos`);
  if (!res.ok) {
    throw new Error('Failed to fetch todos');
  }
  return res.json();
};

export const getTodo = async (id: number): Promise<Todo> => {
  await sleep();
  const res = await fetch(`${BASE_URL}/todos/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch todo');
  }
  return res.json();
};

export const createTodo = async (name: string) => {
  await sleep();
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
  await sleep();
  await fetch(`${BASE_URL}/todos/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: params.name, done: params.done }),
  });
};

export const deleteTodo = async (id: number) => {
  await sleep();
  await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
};
