import { useState } from "react";
import Landing from "./pages/Home/Landing";
import MapView from "./pages/Map/MapView";

type Page = "landing" | "map";

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  return (
    <div className="font-sans">
      {page === "landing" ? (
        <Landing onGetStarted={() => setPage("map")} />
      ) : (
        <MapView />
      )}
    </div>
  );
}
