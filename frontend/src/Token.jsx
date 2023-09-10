const Token = (props) => {
  return (
    <section className="flex justify-center items-center h-screen">
      <div className="main">
        <div className="gradient"></div>
      </div>
      <main className="app">
        <div className="w-full h-full flex justify-center items-center">
          <h1 className={`head_text text-center ${props.color}`}>
            {props.text}
          </h1>
        </div>
      </main>
    </section>
  );
};

export default Token;
