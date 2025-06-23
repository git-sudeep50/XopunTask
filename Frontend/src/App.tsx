import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom"
import SignUpSIngIn from "./Components/SignUpSIngIn"
import Homepage from "./pages/Home.page"
import Projects from "./Components/Projects"
import Dashboard from "./Components/Dashboard"
import ProjectDetails from "./Components/Project.Details"


function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUpSIngIn/>}/>
      <Route path="/home" element={<Homepage/>}>
      <Route path="/home" element={<Dashboard/>}/>
      <Route path="/home/projects" element={<Projects/>}/>
      <Route path="/home/project/:projectId" element={<ProjectDetails/>}/>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>

    </BrowserRouter>
  )
}

export default App
