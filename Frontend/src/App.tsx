import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignUpSIngIn from "./Components/SignUpSIngIn"
import Homepage from "./pages/Home.page"


function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUpSIngIn/>}/>
      <Route path="/home" element={<Homepage/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
