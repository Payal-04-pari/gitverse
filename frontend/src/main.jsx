import { createRoot } from 'react-dom/client'
import './index.css'
import {AuthProvider} from './authContext.jsx'
import ProjectRoutes from './Rout.jsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
      <AuthProvider>
         <ProjectRoutes />
      </AuthProvider>
   </BrowserRouter>
)
