import PostCard from "./PostCard";

export default function PostGrid({ posts }) {
  if (!posts?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
        No hay publicaciones para mostrar.
      </div>
    );
  }

  return (
    <div className="grid-layout">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}