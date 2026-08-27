
import { Link } from "react-router";
import { LoginComponent } from "../components/Auth/LoginComponent";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 p-4 font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-200 opacity-40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-200 opacity-40 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <Link
          to="/"
          className="inline-block text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500 mb-6"
        >
          🪔 RakhiPay
        </Link>
        <LoginComponent />

        <p className="text-center text-gray-500 text-sm mt-8">
          Don't have an account?{" "}
          <Link
            to="/auth/register-brother"
            className="text-rose-600 font-medium hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
