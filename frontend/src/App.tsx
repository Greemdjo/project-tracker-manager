import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Layout from './components/layout/Layout'

import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Developers from './pages/Developers'
import Reports from './pages/Reports'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/projects" element={<Projects />} />

          <Route
            path="/projects/:id"
            element={<ProjectDetail />}
          />

          <Route
            path="/developers"
            element={<Developers />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />
        </Route>

        <Route
          path="*"
          element={
            <div className="p-10 text-center">
              <h1 className="text-3xl font-bold">
                404
              </h1>
              <p className="mt-2 text-slate-500">
                Страница не найдена
              </p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App