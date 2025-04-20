import Head from "next/head";
import Feed from "@/components/Feed";

export default function Home() {
  return (
    <>
      <Head>
        <title>Alumni Connect | Home Feed</title>
      </Head>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">📢 Alumni Feed</h1>
        <Feed />
      </div>
    </>
  );
}
