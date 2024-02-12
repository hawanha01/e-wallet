import { SkeletonTheme } from "react-loading-skeleton";
import "./App.css";
import Welcome from "./pages/welcome/Welcome";
function App() {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="App">
        <Welcome />
      </div>
    </SkeletonTheme>
  );
}

export default App;
