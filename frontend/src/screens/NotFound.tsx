import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-screen w-full bg-zinc-900 flex items-center justify-center text-white">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-zinc-400">Page not found</p>

        <Link
          to="/"
          className="inline-block mt-4 text-sm text-white underline underline-offset-4 hover:text-zinc-300"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
