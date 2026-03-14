export default function PackageCard({ pkg, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(pkg)}
      className={`flex-1 rounded-2xl p-4 text-left transition-all border ${
        selected
          ? 'bg-indigo-500/20 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      <div className={`text-2xl mb-2`}>{pkg.type === 'time' ? '⏱️' : '📦'}</div>
      <div className="text-white font-bold text-sm">{pkg.label}</div>
      <div className={`text-xs mt-1 font-semibold ${selected ? 'text-indigo-400' : 'text-sky-400'}`}>
        {pkg.priceSol} SOL
      </div>
    </button>
  );
}
