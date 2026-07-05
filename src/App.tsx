import Nav from "./components/climb/Nav";
import Scene from "./components/climb/Scene";
import Journey from "./components/climb/Journey";
import WaypointRail from "./components/climb/WaypointRail";

export default function App() {
  return (
    <div id="top">
      <Nav />
      <WaypointRail />
      <main>
        <Scene />
        <Journey />
      </main>
    </div>
  );
}
