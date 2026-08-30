import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

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

const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: string;
}) => {
  const profile = useSelector((state: any) => state.userProfile.profile);
  if (!profile || profile.role !== allowedRole) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

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
      } finally {
        setIsInitializing(false);
      }
    };

    initializeUser();
  }, [dispatch]);

  if (isInitializing) {
    return null; // Or a loading spinner
  }

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>

      <Route path="/auth">
        <Route path="login" element={<Login />}></Route>
        <Route path="register-brother" element={<Register />}></Route>
      </Route>

      {/* must be brother and logged in */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="BROTHER">
            <BrotherDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="profile" element={<SharedAccount />} />
      </Route>

      {/* must be brother and logged in */}
      <Route
        path="/dashboard/invitation/:sisterId"
        element={
          <ProtectedRoute allowedRole="BROTHER">
            <Invitation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/quizzes/:quizId"
        element={
          <ProtectedRoute allowedRole="BROTHER">
            <SisterQuiz />
          </ProtectedRoute>
        }
      />

      {/* must be logged in and should be sister */}
      <Route
        path="/sisterDashboard"
        element={
          <ProtectedRoute allowedRole="SISTER">
            <SisterDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="myquizzes" replace />} />
        <Route path="myquizzes" element={<SisterMyQuizzes />} />
        <Route path="account" element={<SharedAccount />} />
      </Route>
      {/* PROTECTED by internal check */}
      <Route
        path="/sisterDashboard/myquizzes/quiz/:quizId"
        element={<TakeQuiz />}
      />
      {/* external protection for role sister and logged in user */}
      <Route
        path="/sisterDashboard/myquiz/quiz/:quizId/payout"
        element={
          <ProtectedRoute allowedRole="SISTER">
            <Payout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sisterDashboard/myquizzes/quiz/:quizId/payout"
        element={
          <ProtectedRoute allowedRole="SISTER">
            <Payout />
          </ProtectedRoute>
        }
      />
      {/* PROTECTED by internal check */}
      <Route path="/payout/:payoutId/confirm" element={<ConfirmPayout />} />
    </Routes>
  );
};

export default App;
