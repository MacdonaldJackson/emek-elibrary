import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <Image
        src="/logo.jpg"
        alt="Emek E-LIBRARY"
        width={40}
        height={40}
        className="h-10 w-10 rounded-md object-cover"
        priority
      />
      <span className="font-serif text-lg font-semibold tracking-wide text-valley-900 group-hover:text-valley-700">
        Emek E-LIBRARY
      </span>
    </Link>
  );
}
