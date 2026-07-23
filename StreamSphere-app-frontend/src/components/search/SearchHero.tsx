import { Search } from "lucide-react";
import { visitorInput, visitorTextAccent } from "@/styles/brandColors";

interface Props {
  query: string;
  setQuery: (value: string) => void;
}

export default function SearchHero({ query, setQuery }: Props) {
  return (
    <section
      className="relative flex h-[55vh] items-center justify-center overflow-hidden border-b border-white/5 md:h-[60vh]"
      style={{
        background:
          "linear-gradient(135deg, rgba(65,15,15,0.35) 0%, rgba(9,9,11,0.95) 50%, rgb(9,9,11) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(215, 55, 45, 0.15)" }}
      />

      <div className="relative z-10 w-full max-w-3xl px-6 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[rgb(215,55,45)]">
          Discover
        </p>
        <h1 className="mb-8 text-4xl font-bold md:text-5xl">
          Explore the <span className={visitorTextAccent}>Universe</span> of <br />
          Movies & Series
        </h1>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series, genres..."
            className={`${visitorInput} rounded-full py-5 pl-16 pr-6 text-lg backdrop-blur-md`}
          />

          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">
            <Search size={20} />
          </span>
        </div>
      </div>
    </section>
  );
}
