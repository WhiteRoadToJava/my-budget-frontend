
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './styles/globals.scss'
import Login from './pages/auth/Login.jsx'
import ForgotPassword from './pages/auth/forgotPassword.jsx'

function App() {


  return (
    <div className="App">

    <BrowserRouter>
      <Routes>
        {/* Your routes and components go here */}
      <Route path="/home" element={<Login />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
