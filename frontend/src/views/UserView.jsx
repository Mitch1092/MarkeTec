import { useLoaderData } from "react-router-dom";

export default function UserView() {
  const users = useLoaderData();

  return (
    <div>
      <h1>Perfil / Usuarios</h1>

      {users.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}