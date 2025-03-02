import { useEffect, useRef, useState } from "react";
import CalculationEngine from "./CalculationEngine";
import LoadInputForm from "./LoadInputForm";
import SupportSelector from "./SupportSelector"; // Import SupportSelector
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BeamCanvas = ({ onResultsComputed, onAddLoad }) => {
  const canvasRef = useRef(null);
  const [beamLength, setBeamLength] = useState(0);
  const [shearData, setShearData] = useState(null);
  const [momentData, setMomentData] = useState(null);
  const [beamSupports, setBeamSupports] = useState([]);
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw beam
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(50 + beamLength * 10, 100);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw supports safely
    if (beamSupports.length > 0) {
      beamSupports.forEach((support) => {
        ctx.beginPath();
        ctx.arc(50 + support.position * 10, 100, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
      });
    }

    // Draw loads safely
    if (loads.length > 0) {
      loads.forEach((load) => {
        ctx.beginPath();
        ctx.moveTo(50 + load.position * 10, 90);
        ctx.lineTo(50 + load.position * 10, 60);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(50 + load.position * 10 - 5, 65);
        ctx.lineTo(50 + load.position * 10, 60);
        ctx.lineTo(50 + load.position * 10 + 5, 65);
        ctx.fillStyle = "red";
        ctx.fill();
      });
    }
  }, [beamLength, beamSupports, loads]);

  const handleResults = (results) => {
    if (!results) return;
    
    const positions = Array.from({ length: beamLength + 1 }, (_, i) => i);
    const shearForces = positions.map((x) => results.shearForceAtX?.(x) || 0);
    const bendingMoments = positions.map((x) => results.bendingMomentAtX?.(x) || 0);

    setShearData({
      labels: positions,
      datasets: [{ label: "Shear Force (kN)", data: shearForces, borderColor: "red", fill: false }],
    });
    
    setMomentData({
      labels: positions,
      datasets: [{ label: "Bending Moment (kNm)", data: bendingMoments, borderColor: "blue", fill: false }],
    });
  };

  const handleAddSupport = (support) => {
    console.log("Support added:", support);
    setBeamSupports((prevSupports) => [...prevSupports, support]);
  };

  const handleAddLoad = ({ beamLength, loads }) => {
    setBeamLength(beamLength);
    setLoads(loads);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={200} style={{ border: "1px solid #000" }} />
      <LoadInputForm onAddLoad={handleAddLoad} />
      <SupportSelector onAddSupport={handleAddSupport} /> {/* Pass handleAddSupport as a prop */}
      <CalculationEngine beamLength={beamLength} supports={beamSupports} loads={loads} onResultsComputed={handleResults} />
      {shearData && <Line data={shearData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />}
      {momentData && <Line data={momentData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />}
    </div>
  );
};

export default BeamCanvas;