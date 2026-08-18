import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Open book resting in a valley — simple mark */}
        <path
          d="M2 24C7 20 12 20 16 23C20 20 25 20 30 24"
          stroke="#c79a3a"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 6C13 4.5 8 4 5 5.5V21C8 19.5 13 20 16 21.5C19 20 24 19.5 27 21V5.5C24 4 19 4.5 16 6Z"
          fill="#173023"
        />
        <path
          d="M16 6V21.5"
          stroke="#c79a3a"
          strokeWidth="1"
        />
      </svg>
      <span className="font-serif text-lg font-semibold tracking-wide text-valley-900 group-hover:text-valley-700">
        Emek E-LIBRARY
      </span>
    </Link>
  );
}
