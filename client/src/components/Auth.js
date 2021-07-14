import React, { useState } from "react";
import { signupUser, signinUser } from "../redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState("signin");

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => {
    return state.user;
  });

  const authenicate = () => {
    if (auth === "signin") {
      dispatch(signinUser({ email, password }));
    } else {
      dispatch(signupUser({ email, password }));
    }
  };

  return (
    <div>
      {loading && (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      )}
      <h1>Please {auth}!</h1>
      {error && <h5>{error}</h5>}
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {auth === "signin" ? (
        <h6 onClick={() => setAuth("signup")}>Don't have an account ?</h6>
      ) : (
        <h6 onClick={() => setAuth("signin")}>Already have an account?</h6>
      )}
      <button
        className="btn #ff4081 pink accent-2"
        onClick={() => authenicate()}
      >
        {auth}
      </button>
    </div>
  );
};

export default Auth;
