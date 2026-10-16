// template.tsx на відміну від layout.tsx перемонтується при кожному переході —
// тому анімація входу спрацьовує на кожній сторінці.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
