export default function EditUserPage({ params }: { params: { id: string } }) {
  console.log("Edit page params:", params);
  return <p>Editing user {params.id}</p>;
}
