import Nav from "./components/climb/Nav";
import Sky from "./components/sky/Sky";
import Chapters from "./components/chapters/Chapters";
import StatsStrip from "./components/film/StatsStrip";
import AlsoShipped from "./components/chapters/AlsoShipped";
import Closer from "./components/closer/Closer";

export default function App() {
  return (
    <div>
      <Nav />
      <main>
        <Sky />
        <Chapters />
        <AlsoShipped />
        <StatsStrip />
        <Closer />
      </main>
      <footer className="border-t border-arctic/8 bg-deep py-6 text-center text-[12.5px] text-steel">
        Syed Shahzaib Haider Rizvi · Islamabad · 2026
      </footer>
    </div>
  );
}
