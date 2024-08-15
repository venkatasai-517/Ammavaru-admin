import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Special from "./components/Specialdays";
import Viralam from "./components/Viralam";
import Photos from "./components/Photos";
import Adds from "./components/Adds";
import Header from "./components/Header";
const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" Component={Special} />
          <Route path="/special" Component={Special} />
          <Route path="/viralam" Component={Viralam} />
          <Route path="/photos" Component={Photos} />
          <Route path="/adds" Component={Adds} />
        </Routes>
      </Router>
    </>
  );
};
export default App;
