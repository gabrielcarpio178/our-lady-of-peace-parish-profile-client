import Login from './components/pages/login'
import Dashboard from './components/pages/admin/dashboard'
import Access_user from './components/pages/admin/access_user'
import Master_list from './components/pages/admin/mastesList'
import Baranagay from './components/pages/admin/barangay'
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoutes from './util/protectedRoutes';
import SurveyForm from './components/pages/admin/surveyForm'
function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoutes/>}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/access_users" element={<Access_user />} />
            <Route path="/admin/master_list" element={<Master_list />} />
            <Route path="/admin/barangay" element={<Baranagay />} />
            <Route path="/surver_form" element={<SurveyForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
