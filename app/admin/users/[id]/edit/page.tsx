export default function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  return <h1>Edit User: {params.id}</h1>;
}
