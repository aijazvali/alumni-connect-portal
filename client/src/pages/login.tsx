import Head from "next/head";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login | Alumni Connect</title>
      </Head>

      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-black shadow-md rounded px-8 py-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
            Login to Your Account
          </h2>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
