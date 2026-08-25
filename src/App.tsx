import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { useDispatch } from "react-redux";

// import pages
import Home from "./pages/Home";
import Register from "./pages/register";
import Login from "./pages/Login";
import BrotherDashboard from "./components/Layouts/BrotherDashboard";
import Accounts from "./pages/Dashboard/Accounts";

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
        <Route path="accounts" element={<Accounts />} />
      </Route>

    </Routes>
  )
}

export default App;


