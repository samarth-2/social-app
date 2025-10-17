import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signin } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Signin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await signin(data);
      reset();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleSuccess =async(response)=>{
    try {
      const { credential } = response;
      const api_url=import.meta.env.VITE_API_URL;
      const res = await axios.post(`${api_url}/google/auth`, {
        credential,
      });

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <div className="flex flex-col bg-white shadow-md rounded-xl p-8 space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">Sign In</h2>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full rounded-md border-2 px-3 py-2 focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300 focus:border-blue-600"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full rounded-md border-2 px-3 py-2 focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300 focus:border-blue-600"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-700 text-white font-medium py-2 rounded-md transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-800"
            }`}
          >
            {isSubmitting ? "Signing in..." : "Submit"}
          </button>

          <div className="flex flex-col items-center justify-center">
            <p>Or</p>
            <GoogleLogin onSuccess={handleGoogleSuccess}
      onError={() => console.log("Google login failed")}/>
          </div>

          <p className="text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
