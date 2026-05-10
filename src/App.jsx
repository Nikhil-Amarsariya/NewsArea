import Navbar from './Components/Navbar'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './Routers/AppRoutes'
import LoadingBar from "react-top-loading-bar";
import { useState, useEffect } from 'react';

const PAGE_SIZE = 6;
const COUNTRY = "us";

function App() {
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("newsarea-theme") === "dark",
  );

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("newsarea-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Router>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <AppRoutes
        pageSize={PAGE_SIZE}
        country={COUNTRY}
        setProgress={setProgress}
      />
    </Router>
  );
}

export default App;
