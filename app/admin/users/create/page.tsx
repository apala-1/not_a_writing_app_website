"use client";

export default function CreateUserPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/user", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      alert("Failed to create user");
      return;
    }

    alert("User created");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" required />
      <input name="role" placeholder="role (admin/user)" />
      <input name="avatar" type="file" />
      <button type="submit">Create</button>
    </form>
  );
}
