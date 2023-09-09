import getBlockchain from "./ethereum.jsx";
import { useEffect, useState } from "react";

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
    return (
      <section className="flex justify-center items-center h-screen">
        <div className="main">
          <div className="gradient"></div>
        </div>
        <main className="app">
          <div className="w-full h-full flex justify-center items-center">
            <h1 className="head_text blue_gradient text-center">LOADING...</h1>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="main">
        <div className="gradient"></div>
      </div>
      <main className="app">
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="head_text orange_gradient text-center">
            WELCOME TO YOUR TOKEN
          </h1>
        </div>
      </main>
    </section>
  );
}

export default App;
