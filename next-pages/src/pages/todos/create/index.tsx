import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { createTodo } from '@/api';

export default function CreateTodo() {
  const router = useRouter();
  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    await createTodo(name);
    await router.push('/todos');
  };

  return (
    <div>
      <h1>Create Todo</h1>
      <form onSubmit={handleCreate}>
        <div className="py-2">
          <label htmlFor="name">Name: </label>
          <input
            className="border-2 border-gray-600 px-2 w-60"
            type="text"
            name="name"
          />
        </div>
        <div className="py-2">
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
}
