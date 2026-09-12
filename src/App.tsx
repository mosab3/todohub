import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import About from '@/pages/About'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Unknown client-side route: show a designed 404 rather than
            silently redirecting, which hides broken links. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}
