import { Button } from "@/components/ui/button"; // shadcn
import { Link } from "react-router-dom";

export default function GuestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Guest Page</h1>
      <Link to="/login">
        <Button>Go to Login</Button>
      </Link>
    </div>
  );
}
