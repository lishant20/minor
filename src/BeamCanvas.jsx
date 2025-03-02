import { useEffect, useRef, useState } from "react";
import CalculationEngine from "./CalculationEngine";
import LoadInputForm from "./LoadInputForm";
import SupportSelector from "./SupportSelector";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./styles/BeamCanvas.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BeamCanvas = () => {
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
        console.log("Drawing load:", load);
        const startX = 50 + load.position * 10;
    
        if (load.type === "point") {
          // Draw point load with an arrow
          ctx.beginPath();
          ctx.moveTo(startX, 90);
    
          if (load.direction === "up") {
            ctx.lineTo(startX, 60); // Arrow pointing up
          } else if (load.direction === "down") {
            ctx.lineTo(startX, 120); // Arrow pointing down
          }
    
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.stroke();
    
          // Arrowhead
          ctx.beginPath();
          if (load.direction === "up") {
            ctx.moveTo(startX - 5, 65);
            ctx.lineTo(startX, 60);
            ctx.lineTo(startX + 5, 65);
          } else if (load.direction === "down") {
            ctx.moveTo(startX - 5, 115);
            ctx.lineTo(startX, 120);
            ctx.lineTo(startX + 5, 115);
          }
          ctx.fillStyle = "red";
          ctx.fill();
    
        } else if (load.type === "udl") {
          // Draw UDL as a rectangle from load.start to load.end
          const startX = 50 + load.start * 10;
          const endX = 50 + load.end * 10;
    
          ctx.beginPath();
          ctx.rect(startX, 85, endX - startX, 5); // Rectangle with small height
          ctx.fillStyle = "red";
          ctx.fill();
    
        } else if (load.type === "trapezoidal") {
          // Draw trapezoidal load as a right-angled triangle (mirrored)
          const startX = 50 + load.start * 10;
          const endX = 50 + load.end * 10;
        
          ctx.beginPath();
          ctx.moveTo(startX, 85); // Start point (base)
          ctx.lineTo(endX, 70);   // Perpendicular line (height = 4) at end
          ctx.lineTo(endX, 85);   // End point
          ctx.closePath();
          ctx.fillStyle = "red";
          ctx.fill();
        }
        
      });
    }
    
    
  }, [beamLength, beamSupports, loads]);

  const handleResults = (results) => {
    if (!results) return;

    const positions = Array.from({ length: beamLength + 1 }, (_, i) => i);
    const shearForces = positions.map((x) => results.shearForceAtX?.(x) || 0);
    const bendingMoments = positions.map((x) => results.bendingMomentAtX?.(x) || 0);

    console.log("Shear Forces:", shearForces);
    console.log("Bending Moments:", bendingMoments);
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
    <div className="container">
      <div className="canvas-container">
        <h3>Beam Analysis</h3>
        <canvas ref={canvasRef} width={600} height={200} />
      </div>
      <div className="controls-container">
        <LoadInputForm onAddLoad={handleAddLoad} />
        <SupportSelector onAddSupport={handleAddSupport} />
        <CalculationEngine beamLength={beamLength} supports={beamSupports} loads={loads} onResultsComputed={handleResults} />
      </div>
      <div className="chart-container">
        {shearData && <Line data={shearData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />}
        {momentData && <Line data={momentData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />}
      </div>
    </div>
  );
};

export default BeamCanvas;