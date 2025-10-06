import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import Images from './pages/Images' 
import Videos from './pages/Videos'
import Audio from './pages/Audio'
import Footer from './components/Footer'
import AllFiles from './pages/AllFiles'

function App() {
  return (
    <Router>
      <div className="h-screen overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/documents" element={<Documents />} />
            <Route path="/dashboard/images" element={<Images />} />
            <Route path="/dashboard/videos" element={<Videos />} />
            <Route path="/dashboard/audio" element={<Audio />} />
            <Route path="/dashboard/all-files" element={<AllFiles />} />
          </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App