import Nav from "./components/climb/Nav";
import Sky from "./components/sky/Sky";
import Stage from "./components/work/Stage";
import Grid from "./components/work/Grid";
import Theatre from "./components/work/Theatre";
import StatsStrip from "./components/film/StatsStrip";
import Closer from "./components/closer/Closer";

export default function App() {
  return (
    <div>
      <Nav />
      <main>
        <Sky />
        <Stage />
        <StatsStrip />
        <Grid />
        <Closer />
      </main>
      <footer className="border-t border-arctic/8 bg-deep py-6 text-center text-[12.5px] text-steel">
        Syed Shahzaib Haider Rizvi · Islamabad · 2026
      </footer>
      <Theatre />
    </div>
  );
}
