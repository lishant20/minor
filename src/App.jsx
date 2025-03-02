import { useState } from "react";
import BeamCanvas from "./BeamCanvas";

function App() {
  const [loads, setLoads] = useState([]);

  const handleAddLoad = (newLoad) => {
    setLoads((prevLoads) => [...prevLoads, newLoad]);
  };

  return (
    <div>
      <h1>Beam Analysis Tool</h1>
      <BeamCanvas beamLength={10} supports={[]} loads={loads} onAddLoad={handleAddLoad} />
    </div>
  );
}

export default App;
