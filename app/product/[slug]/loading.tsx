export default function ProductLoading() {
  return (
    <>
      <div className="route-bar" aria-hidden="true" />
      <main className="px-5 md:px-8">
        <div className="max-w-[1360px] mx-auto grid md:grid-cols-[1.2fr_1fr] gap-14 py-14 pb-28">
          <div>
            <div className="skeleton aspect-[4/5] mb-2.5" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square" />
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="skeleton h-9 w-3/4" />
            <div className="skeleton h-6 w-28" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-12 w-2/3" />
            <div className="skeleton h-14 w-full" />
          </div>
        </div>
      </main>
    </>
  );
}
