import { useState } from "react";

export default function BreakdownSection({ label, data }) {
  const [expanded, setExpanded] = useState(false);
  const sum = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="mb-4">
      <button
        className="text-left w-full font-semibold underline text-blue-600 mb-1"
        onClick={() => setExpanded(!expanded)}
      >
        {label} Total: ₡{sum.toFixed(2)} {expanded ? '▲' : '▼'}
      </button>
      {expanded && (
        <ul className="ml-4 list-disc">
          {data.map((item, idx) => (
            <li key={idx}>Range {item.range}: ₡{item.value.toFixed(2)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
