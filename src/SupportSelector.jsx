import { useState } from "react";

const SupportSelector = ({ onAddSupport }) => {
  const [type, setType] = useState("pinned");
  const [position, setPosition] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding support:", { type, position: parseFloat(position) });
    onAddSupport({ type, position: parseFloat(position) });
    setPosition(0);
    setType("pinned");
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-row">
      <label>
        Support Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="pinned">Pinned Support</option>
          <option value="roller">Roller Support</option>
          <option value="fixed">Fixed Support</option>
          <option value="hinge">Internal Hinge</option>
        </select>
      </label>
      <label>
        Position:
        <input type="number" value={position} onChange={(e) => setPosition(e.target.value)} required />
      </label>
      
      <button className="button-50" type="submit">Add Support</button>
      </div>
    </form>
  );
};

export default SupportSelector;
