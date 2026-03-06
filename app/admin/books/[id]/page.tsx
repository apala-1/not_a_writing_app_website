// // app/admin/books/[id]/page.tsx
// import { cookies } from "next/headers";
// import { notFound } from "next/navigation";
// import AdminHeader from "../../_components/AdminHeader";
// import AdminBookForm from "../../_components/AdminBookForm";

// async function fetchBook(id: string) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("accessToken")?.value;
//     console.log("Fetching book id:", id);
//   console.log("Access token:", token);
//   if (!token) throw new Error("No access token found");
//   if (!id) throw new Error("No book ID provided");

//   const res = await fetch(`http://localhost:3000/api/v1/admin/books/${id}`, {
//     headers: { cookie: `accessToken=${token}` },
//     cache: "no-store",
//   });

//   if (res.status === 404) return null;
//   if (!res.ok) throw new Error("Failed to fetch book");

//    console.log("Fetch status:", res.status);
//   const json = await res.json();
  
//   console.log("Fetch response body:", json.data);
//   return json.data;
// }

// export default async function AdminUpdateBookPage({ params }: { params: any }) {
//   const unwrappedParams = await params;
//   const id = unwrappedParams.id;
//   if (!id) return notFound();

//   const book = await fetchBook(id);
//   if (!book) return notFound();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AdminHeader />
//       <main className="max-w-3xl mx-auto px-6 py-8">
//         <h1 className="text-2xl font-bold mb-6">Update Book</h1>
//         <AdminBookForm book={book} />
//       </main>
//     </div>
//   );
// }