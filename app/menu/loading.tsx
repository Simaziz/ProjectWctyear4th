export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-64 rounded-3xl bg-stone-200 animate-pulse"
        />
      ))}
    </div>
  );
}