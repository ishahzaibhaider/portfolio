import Nav from "./components/climb/Nav";
import Scene from "./components/climb/Scene";
import Work from "./components/climb/Work";
import Contact from "./components/climb/Contact";

export default function App() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Scene />
        <Work />
        <Contact />
      </main>
    </div>
  );
}
