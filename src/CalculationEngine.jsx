import { useEffect, useState } from "react";

const CalculationEngine = ({ beamLength, supports, loads, onResultsComputed }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (loads.length === 0 || supports.length < 2) return;

    const calculateReactions = () => {
      let totalVerticalLoad = 0;
      let momentAboutA = 0;

      const A = supports[0].position;
      const B = supports[1].position;

      loads.forEach((load) => {
        if (load.type === "point") {
          totalVerticalLoad += load.magnitude * (load.direction === "up" ? -1 : 1);
          momentAboutA += load.magnitude * (load.position - A);
        } else if (load.type === "moment") {
          momentAboutA += load.magnitude * (load.momentDirection === "clockwise" ? -1 : 1);
        } else if (load.type === "udl") {
          const length = load.end - load.start;
          const equivalentLoad = load.magnitude * length;
          const equivalentPosition = load.start + length / 2;
          totalVerticalLoad += equivalentLoad * (load.direction === "up" ? -1 : 1);
          momentAboutA += equivalentLoad * (equivalentPosition - A);
        } else if (load.type === "trapezoidal") {
          const length = load.end - load.start;
          const equivalentLoad = (load.startMagnitude + load.endMagnitude) * length / 2;
          const equivalentPosition =
            (load.start * load.endMagnitude + load.end * load.startMagnitude) / (load.startMagnitude + load.endMagnitude);
          totalVerticalLoad += equivalentLoad * (load.direction === "up" ? -1 : 1);
          momentAboutA += equivalentLoad * (equivalentPosition - A);
        }
      });

      const Rb = momentAboutA / (B - A);
      const Ra = totalVerticalLoad - Rb;

      setResults({ Ra, Rb });
      onResultsComputed({ Ra, Rb, shearForceAtX, bendingMomentAtX });
    };

    const shearForceAtX = (x) => {
      let shear = 0;
      if (x < supports[0].position) return 0;
      shear += results?.Ra || 0;

      loads.forEach((load) => {
        if (load.type === "point" && load.position <= x) {
          shear += load.magnitude * (load.direction === "up" ? -1 : 1);
        } else if (load.type === "udl" && load.start <= x) {
          const effectiveLength = Math.min(x, load.end) - load.start;
          const udlForce = load.magnitude * effectiveLength;
          shear += udlForce * (load.direction === "up" ? -1 : 1);
        } else if (load.type === "trapezoidal" && load.start <= x) {
          const dx = Math.min(x, load.end) - load.start;
          const equivalentLoad = (load.startMagnitude + (load.startMagnitude + (load.endMagnitude - load.startMagnitude) * (dx / (load.end - load.start)))) * dx / 2;
          shear += equivalentLoad * (load.direction === "up" ? -1 : 1);
        }
      });

      return shear;
    };

    const bendingMomentAtX = (x) => {
      let moment = 0;
      if (x < supports[0].position) return 0;
      moment += (results?.Ra || 0) * (x - supports[0].position);

      loads.forEach((load) => {
        if (load.type === "point" && load.position <= x) {
          moment += load.magnitude * (load.position - x) * (load.direction === "up" ? -1 : 1);
        } else if (load.type === "moment" && load.position <= x) {
          moment += load.magnitude * (load.momentDirection === "clockwise" ? -1 : 1);
        } else if (load.type === "udl" && load.start <= x) {
          const effectiveLength = Math.min(x, load.end) - load.start;
          const udlForce = load.magnitude * effectiveLength;
          const centroid = load.start + effectiveLength / 2;
          moment += udlForce * (centroid - x) * (load.direction === "up" ? -1 : 1);
        } else if (load.type === "trapezoidal" && load.start <= x) {
          const dx = Math.min(x, load.end) - load.start;
          const equivalentLoad = (load.startMagnitude + (load.startMagnitude + (load.endMagnitude - load.startMagnitude) * (dx / (load.end - load.start)))) * dx / 2;
          const centroid = load.start + dx / 2;
          moment += equivalentLoad * (centroid - x) * (load.direction === "up" ? -1 : 1);
        }
      });

      return moment;
    };

    calculateReactions();
  }, [beamLength, supports, loads, onResultsComputed]);

  return (
    <div>
      <h3>Calculation Results:</h3>
      {results ? (
        <>
          <ul>
            <li>Reaction at A (Ra): {results.Ra.toFixed(2)} kN</li>
            <li>Reaction at B (Rb): {results.Rb.toFixed(2)} kN</li>
          </ul>
          <h4>Calculate Shear Force & Bending Moment:</h4>
          <input
            type="number"
            placeholder="Enter position (x)"
            onChange={(e) => {
              const x = parseFloat(e.target.value);
              if (!isNaN(x)) {
                alert(
                  `Shear Force at x=${x}: ${shearForceAtX(x).toFixed(2)} kN\nBending Moment at x=${x}: ${bendingMomentAtX(x).toFixed(2)} kNm`
                );
              }
            }}
          />
        </>
      ) : (
        <p>Enter valid supports and loads to calculate reactions.</p>
      )}
    </div>
  );
};

export default CalculationEngine;