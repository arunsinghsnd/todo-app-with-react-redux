import React, { useEffect } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Todo from "./components/Todo";
import { useSelector, useDispatch } from "react-redux";
import { addToken } from "./redux/reducers/authReducer";

function App() {
  const token = useSelector(state => {
    return state.user.token;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addToken());
  }, []);

  return <div className="App">{token ? <Todo /> : <Auth />}</div>;
}

export default App;
