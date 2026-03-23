import "./landing.css";

/**
 * Landing Page Layout — 100% standalone.
 * Only imports landing.css — which has its own @import "tailwindcss"
 * and defines ALL needed CSS variables internally.
 * No dependency on globals.css or any other project CSS.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
