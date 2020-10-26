import React, { useState, useEffect } from "react";
import theme from "@mono/theme";
import { getFake, hello } from "@mono/lib";

function App() {
  interface IData {
    userId: number;
    id: number;
    title: string;
    complete: boolean;
  }

  const [data, setData] = useState<IData>({
    userId: 0,
    id: 0,
    title: "",
    complete: false,
  });

  useEffect(() => {
    getFake(10).then((res: any) => setData(res));
  }, []);

  return (
    <div style={{ color: theme.blue }} className="App">
      {data?.title}
      <p>{hello}</p>
    </div>
  );
}

export default App;
