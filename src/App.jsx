
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './styles/globals.scss'
import Login from './pages/auth/login.jsx'

function App() {


  return (
    <div className="App">

    <BrowserRouter>
      <Routes>
        {/* Your routes and components go here */}
      <Route path="/home" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
