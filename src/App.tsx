import Login from './components/pages/Login'
import Dashboard from './components/pages/admin/Dashboard'
import Access_user from './components/pages/admin/Access_user'
import Baranagay from './components/pages/admin/Barangay'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import ProtectedRoutes from './util/protectedRoutes';
import SurveyForm from './components/pages/admin/SurveyForm'
import Household from './components/pages/admin/Household'
import EditSurveyForm from './components/pages/admin/EditHouseholdform'
import Records from './components/pages/admin/Records'
import Settings from './components/pages/admin/Settings'
import CoverPage from './components/pages/CoverPage'
import Single_infoForm from './components/pages/admin/subpage/Single_infoForm';
import Living_alone from './components/pages/admin/subpage/Living_alone';
import Widowed from './components/pages/admin/subpage/Widowed';
import Widower from './components/pages/admin/subpage/Widower';
import Sick from './components/pages/admin/subpage/Sick';


function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/access_users" element={<Access_user />} />
            <Route path="master_list/barangay" element={<Baranagay />} />
            <Route path="master_list/household" element={<Household />} />
            <Route path="/survey_form" element={<SurveyForm />} >
              <Route index element={<Navigate to="sick?life_status=sick" replace />} />
              <Route path='single' element={<Single_infoForm />} />
              <Route path='living alone' element={<Living_alone />} />
              <Route path='widowed' element={<Widowed />} />
              <Route path='widower' element={<Widower />} />
              <Route path='sick' element={<Sick />} />
            </Route>
            <Route path="/survey_form/:id" element={<EditSurveyForm />} >
              <Route path='single' element={<Single_infoForm />} />
              <Route path='living alone' element={<Living_alone />} />
              <Route path='widowed' element={<Widowed />} />
              <Route path='widower' element={<Widower />} />
              <Route path='sick' element={<Sick />} />
            </Route>
            <Route path='/records' element={<Records/>}></Route>
            <Route path='/settings' element={<Settings/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
