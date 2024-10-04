export const load = async ({ params, fetch }) => {
  const response = await fetch(`/api/item/${params.id}`);
  return await response.json();
}