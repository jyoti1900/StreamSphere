interface Props {
  genres: string[];
  activeGenre: string | null;
  setActiveGenre: (genre: string | null) => void;
}

const activeFilter =
  "border-[rgb(215,55,45)] bg-[rgb(175,35,30)] text-white";
const inactiveFilter =
  "border-white/10 bg-white/5 text-zinc-300 hover:bg-[rgba(175,35,30,0.2)] hover:text-white";

export default function SearchFilters({
  genres,
  activeGenre,
  setActiveGenre,
}: Props) {
  return (
    <section className="overflow-x-auto px-6 py-6">
      <div className="flex gap-3">
        <button
          onClick={() => setActiveGenre(null)}
          className={`cursor-pointer whitespace-nowrap rounded-full border px-5 py-2 text-sm transition ${
            activeGenre === null ? activeFilter : inactiveFilter
          }`}
        >
          All
        </button>

        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
            className={`cursor-pointer whitespace-nowrap rounded-full border px-5 py-2 text-sm transition ${
              activeGenre === genre ? activeFilter : inactiveFilter
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
}
