// based on the tutorial from https://usehooks.com/useAuth/

import { createContext, useState } from "react";
// a bug with this hook prevented me from using it 😢
// import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

let AuthContext = createContext();

// This is what we export from this file
export default AuthContext;

// Provider hook that creates auth object and handles state
export function useProvideAuth() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(
    window.localStorage.getItem("loggedIn")
  );

  async function login(values, form) {
    const response = await fetch("https://tpeo-todo.herokuapp.com/auth/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ email: values.email, password: values.password }) // body data type must match "Content-Type" header
    })
      .then((response) => {
        console.log(response.status);
        if (response.status !== 200) {
          throw new Error();
        }
        return response.json();
      })
      .then((response) => {
        setLoggedIn(true);
        window.localStorage.setItem("loggedIn", true);
        window.localStorage.setItem("Token", response.token);
        window.localStorage.setItem("username", response.username);
        navigate("../");
        console.log(response);
      })
      .catch((e) => {
        form.setErrors({ email: true, password: "invalid login" });
      });
  }

  function logout() {
    // In Class TODO: Implement this function
    window.localStorage.clear("loggedIn");
    window.localStorage.clear("username");
    setLoggedIn(false);
    navigate("../login");
    console.log(loggedIn);
  }

  return {
    loggedIn,
    login,
    logout
  };
}
