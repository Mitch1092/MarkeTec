import { useLoaderData } from "react-router-dom";

export default function PostView() {
  const post = useLoaderData();

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <p>${post.price}</p>
    </div>
  );
}