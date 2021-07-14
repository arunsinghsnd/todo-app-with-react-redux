import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTodo,
  fetchTodo,
  deleteTodo,
} from "../redux/reducers/todoReducer";
import { logout } from "../redux/reducers/authReducer";

const Todo = () => {
  const [mytodo, setMyTodo] = useState("");
  const dispatch = useDispatch();

  const todos = useSelector(state => state.todos);

  useEffect(() => {
    dispatch(fetchTodo());
  }, []);

  const addTodo = () => {
    dispatch(createTodo({ todo: mytodo }));
  };
  return (
    <div>
      <input
        placeholder="Write your Todo"
        type="text"
        value={mytodo}
        onChange={e => setMyTodo(e.target.value)}
      />
      <button className="btn #ff4081 pink accent-2" onClick={() => addTodo()}>
        Add Todo
      </button>
      <ul className="collection">
        {todos.map(item => {
          return (
            <li
              className="collection-item"
              key={item._id}
              onClick={() => dispatch(deleteTodo(item._id))}
            >
              {item.todo}
            </li>
          );
        })}
      </ul>

      <button
        className="btn #ff4081 pink accent-2"
        onClick={() => dispatch(logout())}
      >
        Log Out
      </button>
    </div>
  );
};

export default Todo;
