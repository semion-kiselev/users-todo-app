import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { getTodo, updateTodo } from '@/api';
import { Todo } from '@/types/todos';

export const getServerSideProps = (async ({ params }) => {
  if (!params) {
    throw new Error('no params for UpdateTodo');
  }
  const todo: Todo = await getTodo(Number(params.id as string));
  return { props: { todo } };
}) satisfies GetServerSideProps<{ todo: Todo }>;

export default function UpdateTodo({
  todo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const id = Number(router.query.id);
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const done = Boolean(formData.get('done'));
    await updateTodo({ id, name, done });
    await router.push('/todos');
  };

  return (
    <div>
      <h1>Update Todo</h1>
      <form onSubmit={handleUpdate}>
        <div className="py-2">
          <label htmlFor="name">Name: </label>
          <input
            defaultValue={todo.name}
            className="border-2 border-gray-600 px-2 w-60"
            type="text"
            name="name"
          />
        </div>
        <div className="py-2">
          <label htmlFor="done">Done: </label>
          <input type="checkbox" name="done" defaultChecked={todo.done} />
        </div>
        <div className="py-2">
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
}
