import Button from "./Button";

export default function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="text-center py-24 px-6">
      <h3 className="font-display font-extrabold text-2xl mb-3">{title}</h3>
      <p className="text-muted text-sm mb-8">{description}</p>
      {ctaLabel && ctaHref && (
        <Button href={ctaHref} variant="ghost">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
