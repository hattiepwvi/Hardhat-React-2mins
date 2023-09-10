import getBlockchain from "./ethereum.jsx";
import { useEffect, useState } from "react";
import Token from "./Token.jsx";

function App() {
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { token } = await getBlockchain();
      setToken(token);
    };
    init();
  }, []);

  if (typeof token === "undefined") {
    return <Token text="LOADING..." color="blue_gradient" />;
  }

  return <Token text="WELCOME TO YOUR TOKEN" color="orange_gradient" />;
}

export default App;
