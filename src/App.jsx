import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import Home from "./pages/Home"
import DailyVichar from "./pages/DailyVichar"
import Kirtan from "./pages/Kirtan"
import Quotes from "./pages/Quotes"
import About from "./pages/About"

function App() {

  return (
    <BrowserRouter>

      <Header />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/vichar" element={<DailyVichar />} />
        <Route path="/kirtan" element={<Kirtan />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/about" element={<About />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
