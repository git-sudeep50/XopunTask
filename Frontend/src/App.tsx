import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignUpSIngIn from "./Components/SignUpSIngIn"


function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUpSIngIn/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
