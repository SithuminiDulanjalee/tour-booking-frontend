import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../service/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passsword, setPasssword] = useState("");
  const [conpasssword, setConPasssword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !passsword || !conpasssword) {
      alert("Please fill all fields..!");
      return;
    }
    if (passsword !== conpasssword) {
      alert("Password not match..!");
      return;
    }
    try {
      await register(name, email, passsword);
      alert("Success..!");
      navigate("/login");
    } catch {
      alert("Registration fail..!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col gap-4 w-80">
        <input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          placeholder="password"
          value={passsword}
          onChange={(e) => setPasssword(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          placeholder="con-password"
          value={conpasssword}
          onChange={(e) => setConPasssword(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleRegister}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Register
        </button>
        <p className="mt-4 text-gray-700 text-center">
          <span>Alrady have an account? </span>
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
