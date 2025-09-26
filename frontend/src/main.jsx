import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/about', element: <App section="about" /> },
  { path: '/highlights', element: <App section="highlights" /> },
  { path: '/projects', element: <App section="projects" /> },
  { path: '/skills', element: <App section="skills" /> },
  { path: '/experience', element: <App section="experience" /> },
  { path: '/education', element: <App section="education" /> },
  { path: '/achievements', element: <App section="achievements" /> },
  { path: '/contact', element: <App section="contact" /> },
  { path: '*', element: <App /> }, // Catch-all route for 404s
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
