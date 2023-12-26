'use client';

import { useRouter } from 'next/navigation';
import { updateTodoAction } from '@/actions';
import { Todo } from '@/types/todos';

export const UpdateTodo = ({ todo }: { todo: Todo }) => {
  const router = useRouter();

  const handleUpdate = async (formData: FormData) => {
    await updateTodoAction(formData);
    router.push('/todos');
  };

  return (
    <div>
      <h1>Update Todo</h1>
      <form action={handleUpdate}>
        <input type="hidden" name="todo-id" value={todo.id} />
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
};
