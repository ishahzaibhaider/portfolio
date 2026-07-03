import Nav from "./components/climb/Nav";
import Scene from "./components/climb/Scene";
import Journey from "./components/climb/Journey";

export default function App() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Scene />
        <Journey />
      </main>
    </div>
  );
}
