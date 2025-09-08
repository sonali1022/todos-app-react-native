import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Todo } from "../types/todo";

// Fetch initial todos from API (optional)
export const fetchTodos = createAsyncThunk("todo/fetchTodos", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=20");
  const data = await res.json();
  return data.map((t: any) => ({
    id: t.id.toString(),
    title: t.title,
    completed: t.completed,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })) as Todo[];
});

interface TodoState {
  todos: Todo[];
  filter: "All" | "Completed" | "Active";
  order: "ASC" | "DESC";
  loading: boolean;
}

const initialState: TodoState = {
  todos: [],
  filter: "All",
  order: "ASC",
  loading: false,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ title: string }>) => {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        id: Math.random().toString(),
        title: action.payload.title,
        completed: false,
        created_at: now,
        updated_at: now,
      };
      state.todos.unshift(newTodo); // new items on top
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const index = state.todos.findIndex(t => t.id === action.payload);
      if (index !== -1) {
        state.todos[index].completed = !state.todos[index].completed;
        state.todos[index].updated_at = new Date().toISOString();
      }
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const index = state.todos.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.todos[index].title = action.payload.title;
        state.todos[index].updated_at = new Date().toISOString();
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<"All" | "Completed" | "Active">) => {
      state.filter = action.payload;
    },
    toggleAll: (state) => {
      const allCompleted = state.todos.every(t => t.completed);
      state.todos.forEach(t => t.completed = !allCompleted);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(t => !t.completed);
    },
    setOrder: (state, action: PayloadAction<"ASC" | "DESC">) => {
      state.order = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTodos.pending, state => { state.loading = true; });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTodos.rejected, state => { state.loading = false; });
  },
});

export const { addTodo, toggleTodo, updateTodo, deleteTodo, setFilter, toggleAll, clearCompleted, setOrder } = todoSlice.actions;
export default todoSlice.reducer;
