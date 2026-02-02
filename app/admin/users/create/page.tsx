"use client";

export default function CreateUserPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch("http://localhost:3000/api/v1/users/", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await res.json();
console.log("Create user response data:", data);


    if (!res.ok) {
      alert("Failed to create user");
      return;
    }

    alert("User created");
  };

  return (
    <form onSubmit={handleSubmit}>
  <input name="name" placeholder="Full Name" required />
  <input name="email" placeholder="Email" required />
  <input name="password" type="password" required />
  <input name="role" placeholder="role (admin/user)" required />
  <input name="profilePicture" type="file" />
  <button type="submit">Create</button>
</form>

  );
}
