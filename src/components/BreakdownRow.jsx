export default function BreakdownRow({ label, data }) {
  return (
    <tr>
      <td className="p-2 border border-gray-400 font-semibold">{label}</td>
      <td className="p-2 border border-gray-400">{data.description}</td>
      <td className="p-2 border border-gray-400 text-right">
        ₡{data.amount?.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
      </td>
    </tr>
  );
}
