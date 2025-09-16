export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <h1 className="text-4xl font-extrabold font-sans mb-8 text-blue-900 drop-shadow-lg">
        Carwash Inventory Login
      </h1>

      <form className="bg-white p-10 rounded-2xl shadow-2xl w-96">
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        <button
          type="button"
          className="w-full bg-blue-700 text-white font-semibold p-3 rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
        >
          Sign In
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Forgot your password? <span className="text-blue-700 underline cursor-pointer">Reset here</span>
        </p>
      </form>

      <p className="mt-8 text-gray-700 font-mono">
        © 2025 Carwash Inventory System
      </p>
    </div>
  );
}
