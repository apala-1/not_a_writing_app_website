"use client";

export default function AdminUsersPage() {
  const users = [
    { id: "1", email: "a@test.com" },
    { id: "2", email: "b@test.com" },
  ];

  return (
    <div>
      <h1>Admin – Users</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            <a href={`/admin/users/${u.id}`}>{u.email}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
