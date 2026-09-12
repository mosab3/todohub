import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import About from '@/pages/About'
import Home from '@/pages/Home'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
