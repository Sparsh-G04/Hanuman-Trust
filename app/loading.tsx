import Image from "next/image";

/** Branded sitewide loading state — pulsing trust logo (spec: pulse/scale-bounce, not spin). */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Image
        src="/logo.svg"
        alt="लोड हो रहा है…"
        width={96}
        height={96}
        priority
        className="animate-scale-pulse"
      />
    </div>
  );
}
