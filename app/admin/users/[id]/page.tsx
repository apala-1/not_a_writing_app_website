export default function UserPage({ params }: { params: { id: string } }) {
  console.log("User page params:", params);
  return <p>Viewing user {params.id}</p>;
}
