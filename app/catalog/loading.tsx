export default function CatalogLoading() {
  return (
    <>
      <div className="route-bar" aria-hidden="true" />
      <main className="px-5 md:px-8 py-14">
        <div className="max-w-[1360px] mx-auto">
          <div className="skeleton h-9 w-56 mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[3/4]" />
                <div className="skeleton h-4 w-3/4 mt-4" />
                <div className="skeleton h-3 w-1/3 mt-2.5" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
