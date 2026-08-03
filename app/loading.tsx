/** Branded sitewide loading state — pulsing trust logo (spec: pulse/scale-bounce, not spin). */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <img
        src="/logo.svg"
        alt="लोड हो रहा है…"
        width={96}
        height={96}
        className="animate-scale-pulse"
      />
    </div>
  );
}
