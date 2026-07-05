import Nav from "./components/climb/Nav";
import HeroFilm from "./components/film/HeroFilm";
import StatsStrip from "./components/film/StatsStrip";
import BuilderFilm from "./components/film/BuilderFilm";
import CloserFilm from "./components/film/CloserFilm";
import Work from "./components/climb/Work";

export default function App() {
  return (
    <div id="top">
      <Nav />
      <main>
        <HeroFilm />
        <StatsStrip />
        <BuilderFilm />
        <Work />
        <CloserFilm />
      </main>
      <footer className="border-t border-arctic/8 bg-deep py-6 text-center text-[12.5px] text-steel">
        Syed Shahzaib Haider Rizvi · Islamabad · 2026
      </footer>
    </div>
  );
}
