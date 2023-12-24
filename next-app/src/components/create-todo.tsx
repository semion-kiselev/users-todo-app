'use client'

import {createTodoAction} from "@/actions";

export const CreateTodo = () => {
  return (
    <div>
      <h1>Create Todo</h1>
      <form action={createTodoAction}>
        <div className="py-2">
          <label htmlFor="name">Name: </label>
          <input
            className="border-2 border-gray-600 px-2 w-60"
            type="text"
            name="name"
            required
          />
        </div>
        <div className="py-2">
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
};