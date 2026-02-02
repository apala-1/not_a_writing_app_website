// admin/users/[id]/page.tsx
import { cookies } from "next/headers";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface Props {
  params: { id: string };
}

const BACKEND_URL = "http://localhost:3000";

export default async function UserPage({ params }: Props) {
  const res = await fetch(`${BACKEND_URL}/api/v1/users/${params.id}`, {
    credentials: "include",
  });

  if (!res.ok) return <p>User not found</p>;

  const data = await res.json();
  const user: User = data.data;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">{user.name}</h1>
      <img
        src={user.profilePicture ? `${BACKEND_URL}/uploads/${user.profilePicture}` : "/default-picture.png"}
        alt={user.name}
        className="w-32 h-32 rounded-full mb-4"
      />
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
