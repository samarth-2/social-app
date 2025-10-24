import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signup } from "../../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Name must only contain letters and spaces")
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed")
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Signup() {
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
      const res = await signup(data);
      reset();
      navigate("/signin");
      toast.success("Signup successful! Please sign in.");
    } catch (err) {
      reset();
      toast.error(err || "Signup failed");
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <div className="flex flex-col bg-white shadow-md rounded-xl p-8 space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">Sign Up</h2>

          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className={`w-full rounded-md border-2 px-3 py-2 focus:outline-none ${
                errors.name ? "border-red-500" : "border-gray-300 focus:border-blue-600"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className={`w-full rounded-md border-2 px-3 py-2 focus:outline-none ${
                errors.username ? "border-red-500" : "border-gray-300 focus:border-blue-600"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

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
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
