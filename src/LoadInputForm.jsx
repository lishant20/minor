import { useState } from "react";

const LoadInputForm = ({ onAddLoad }) => {
  const [beamLength, setBeamLength] = useState(0);
  const [loadType, setLoadType] = useState("point");
  const [loads, setLoads] = useState([]);

  // Common load properties
  const [position, setPosition] = useState(0);
  const [magnitude, setMagnitude] = useState(0);
  const [angle, setAngle] = useState(90);
  const [direction, setDirection] = useState("down");
  const [momentDirection, setMomentDirection] = useState("clockwise");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [startMagnitude, setStartMagnitude] = useState(0);
  const [endMagnitude, setEndMagnitude] = useState(0);

  const handleAddLoad = () => {
    const newLoad = { type: loadType };

    if (loadType === "point") {
      newLoad.position = parseFloat(position);
      newLoad.magnitude = parseFloat(magnitude);
      newLoad.angle = parseFloat(angle);
      newLoad.direction = direction;
    } else if (loadType === "moment") {
      newLoad.position = parseFloat(position);
      newLoad.magnitude = parseFloat(magnitude);
      newLoad.momentDirection = momentDirection;
    } else if (loadType === "udl") {
      newLoad.start = parseFloat(start);
      newLoad.end = parseFloat(end);
      newLoad.magnitude = parseFloat(magnitude);
      newLoad.direction = direction;
    } else if (loadType === "trapezoidal") {
      newLoad.start = parseFloat(start);
      newLoad.end = parseFloat(end);
      newLoad.startMagnitude = parseFloat(startMagnitude);
      newLoad.endMagnitude = parseFloat(endMagnitude);
      newLoad.direction = direction;
    }

    if (validateLoad(newLoad)) {
      setLoads([...loads, newLoad]);
      resetForm();
    } else {
      alert("Please enter valid positions within the beam length.");
    }
  };

  const validateLoad = (load) => {
    if (load.type === "point" || load.type === "moment") {
      return load.position >= 0 && load.position <= beamLength;
    } else if (load.type === "udl" || load.type === "trapezoidal") {
      return load.start >= 0 && load.end <= beamLength && load.start < load.end;
    }
    return false;
  };

  const resetForm = () => {
    setPosition(0);
    setMagnitude(0);
    setAngle(90);
    setDirection("down");
    setMomentDirection("clockwise");
    setStart(0);
    setEnd(0);
    setStartMagnitude(0);
    setEndMagnitude(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddLoad({ beamLength, loads });
    setLoads([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Beam Length:
        <input type="number" value={beamLength} onChange={(e) => setBeamLength(e.target.value)} required />
      </label>

      <label>
        Load Type:
        <select value={loadType} onChange={(e) => setLoadType(e.target.value)}>
          <option value="point">Point Load</option>
          <option value="moment">Bending Moment</option>
          <option value="udl">Uniform Distributed Load (UDL)</option>
          <option value="trapezoidal">Triangular/Trapezoidal Load</option>
        </select>
      </label>

      {loadType === "point" && (
        <>
          <label>
            Position:
            <input type="number" value={position} onChange={(e) => setPosition(e.target.value)} required />
          </label>
          <label>
            Magnitude:
            <input type="number" value={magnitude} onChange={(e) => setMagnitude(e.target.value)} required />
          </label>
          <label>
            Angle (°):
            <input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} required />
          </label>
          <label>
            Direction:
            <select value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </label>
        </>
      )}

      {loadType === "moment" && (
        <>
          <label>
            Position:
            <input type="number" value={position} onChange={(e) => setPosition(e.target.value)} required />
          </label>
          <label>
            Magnitude:
            <input type="number" value={magnitude} onChange={(e) => setMagnitude(e.target.value)} required />
          </label>
          <label>
            Moment Direction:
            <select value={momentDirection} onChange={(e) => setMomentDirection(e.target.value)}>
              <option value="clockwise">Clockwise</option>
              <option value="anticlockwise">Anticlockwise</option>
            </select>
          </label>
        </>
      )}

      {loadType === "udl" && (
        <>
          <label>
            Start Position:
            <input type="number" value={start} onChange={(e) => setStart(e.target.value)} required />
          </label>
          <label>
            End Position:
            <input type="number" value={end} onChange={(e) => setEnd(e.target.value)} required />
          </label>
          <label>
            Load Magnitude:
            <input type="number" value={magnitude} onChange={(e) => setMagnitude(e.target.value)} required />
          </label>
          <label>
            Load Direction:
            <select value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </label>
        </>
      )}

      {loadType === "trapezoidal" && (
        <>
          <label>
            Start Position:
            <input type="number" value={start} onChange={(e) => setStart(e.target.value)} required />
          </label>
          <label>
            End Position:
            <input type="number" value={end} onChange={(e) => setEnd(e.target.value)} required />
          </label>
          <label>
            Start Magnitude:
            <input type="number" value={startMagnitude} onChange={(e) => setStartMagnitude(e.target.value)} required />
          </label>
          <label>
            End Magnitude:
            <input type="number" value={endMagnitude} onChange={(e) => setEndMagnitude(e.target.value)} required />
          </label>
          <label>
            Load Direction:
            <select value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </label>
        </>
      )}

      <button type="button" onClick={handleAddLoad}>Add Load</button>
      <button type="submit">Submit Loads</button>

      <h3>Added Loads:</h3>
      <ul>
        {loads.map((load, index) => (
          <li key={index}>
            {load.type.toUpperCase()} Load at {load.position ?? load.start}-{load.end ?? ""} 
            {load.magnitude && ` | Magnitude: ${load.magnitude}`}
            {load.startMagnitude && ` | Start Mag: ${load.startMagnitude}`}
            {load.endMagnitude && ` | End Mag: ${load.endMagnitude}`}
            {load.direction && ` | Direction: ${load.direction}`}
            {load.angle && ` | Angle: ${load.angle}°`}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default LoadInputForm;