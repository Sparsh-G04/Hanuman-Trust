import { waLink } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";

/** Floating WhatsApp button — fixed bottom-right, visible on every page. */
export default function WhatsAppFloat() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp पर संपर्क करें"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 hover:shadow-xl"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
