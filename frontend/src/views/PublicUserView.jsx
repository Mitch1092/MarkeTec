import { useLoaderData } from "react-router-dom";

export default function PublicUserView() {
  const user = useLoaderData();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}