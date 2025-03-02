import { useState } from "react";
import BeamCanvas from "./BeamCanvas";
import "./styles/App.css"; // Import the CSS file

function App() {
  const [loads, setLoads] = useState([]);

  const handleAddLoad = (newLoad) => {
    setLoads((prevLoads) => [...prevLoads, newLoad]);
  };

  return (
    <>
    <div className="app-container">
      <BeamCanvas beamLength={10} supports={[]} loads={loads} onAddLoad={handleAddLoad} />
</div>
  <a href="https://graph2d.netlify.app/" target="_blank" rel="noopener noreferrer" className="external-link">
  Go to Graph2D
</a>
</>
  );
}

export default App;