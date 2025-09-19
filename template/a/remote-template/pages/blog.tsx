import { Link, useLoaderData } from 'react-router';

export function Blog() {
  const loaderData = useLoaderData();
  return (
    <div>
      {loaderData && (
        <div>
          id: {loaderData.id}, name: {loaderData.name}
        </div>
      )}
      <Link to="/">goto /home</Link>
    </div>
  );
}
