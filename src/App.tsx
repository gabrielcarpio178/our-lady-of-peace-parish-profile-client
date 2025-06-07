import Login from './components/pages/login'
import Dashboard from './components/pages/admin/dashboard'
import Access_user from './components/pages/admin/access_user'
import Master_list from './components/pages/admin/mastesList'
import Baranagay from './components/pages/admin/barangay'
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoutes from './util/protectedRoutes';
import SurveyForm from './components/pages/admin/surveyForm'
import Household from './components/pages/admin/household'
import EditSurveyForm from './components/pages/admin/editHouseholdform'
import Records from './components/pages/admin/records'
import { SocketProvider } from './util/socketContext'
import Settings from './components/pages/admin/settings'


function App() {
  
  return (
    <>
    
    <SocketProvider>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoutes/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/access_users" element={<Access_user />} />
            <Route path="/master_list" element={<Master_list />} />
            <Route path="/barangay" element={<Baranagay />} />
            <Route path="/survey_form" element={<SurveyForm />} />
            <Route path="/household" element={<Household />} />
            <Route path="/survey_form/:id" element={<EditSurveyForm />} />
            <Route path='/records' element={<Records/>}></Route>
            <Route path='/settings' element={<Settings/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      
    </SocketProvider>
    </>
  )
}

export default App
