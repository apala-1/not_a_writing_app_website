export default function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <h1>User ID: {params.id}</h1>;
}
