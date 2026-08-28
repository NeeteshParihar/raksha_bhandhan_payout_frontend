import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useDispatch } from "react-redux";

// import pages
import Home from "./pages/Home";
import Register from "./pages/register";
import Login from "./pages/Login";
import BrotherDashboard from "./components/Layouts/BrotherDashboard";
import SisterDashboard from "./components/Layouts/SisterDashboard";
import Overview from "./pages/Dashboard/Overview";
import Accounts from "./pages/Dashboard/Accounts";

import Quizzes from "./pages/Dashboard/Quizzes";
import SisterQuiz from "./pages/Dashboard/SisterQuiz";
import SisterMyQuizzes from "./pages/Dashboard/SisterMyQuizzes";
import TakeQuiz from "./pages/Dashboard/TakeQuiz";
import Payout from "./pages/Dashboard/Payout";
import Coupons from "./pages/Dashboard/Coupons";
import Invitation from "./pages/Dashboard/Invitation";
import ConfirmPayout from "./pages/ConfirmPayout";
import SharedAccount from "./pages/Dashboard/SharedAccount";

// import services & actions
import { fetchUserProfile } from "./services/user";
import { login } from "./features/userProfileSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await fetchUserProfile();
        if (response.success && response.data) {
          dispatch(login(response.data));
        }
      } catch (error) {
        // Safe to ignore, user is just not logged in
        console.log("No active session found.");
      }
    };

    initializeUser();
  }, [dispatch]);


  return (
    <Routes>

      <Route path="/" element={ <Home/> }>
      </Route>

      <Route  path="/auth">
        <Route path="login" element={<Login />}>
        </Route>
        <Route path="register-brother" element={<Register />}>
        </Route>
      </Route>

      <Route path="/dashboard" element={<BrotherDashboard/>} >
        <Route index element={<Overview />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="profile" element={<SharedAccount />} />
      </Route>
        <Route path="/dashboard/invitation/:sisterId" element={<Invitation />} />
      <Route path="/dashboard/quizzes/:quizId" element={<SisterQuiz />} />
      
      <Route path="/sisterDashboard" element={<SisterDashboard />}>
        <Route index element={<Navigate to="myquizzes" replace />} />
        <Route path="myquizzes" element={<SisterMyQuizzes />} />
        <Route path="account" element={<SharedAccount />} />
      </Route>
       <Route path="/sisterDashboard/myquizzes/quiz/:quizId" element={<TakeQuiz />} />
       <Route path="/sisterDashboard/myquiz/quiz/:quizId/payout" element={<Payout />} />
       <Route path="/sisterDashboard/myquizzes/quiz/:quizId/payout" element={<Payout />} />
       <Route path="/payout/:payoutId/confirm" element={<ConfirmPayout />} />
    </Routes>
  )
}

export default App;


