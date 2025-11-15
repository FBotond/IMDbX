import { getMovieDetails } from "@/lib/tmdb";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const movieId = params.id;

  try {
    const movie = await getMovieDetails(Number(movieId));

    return {
      title: movie.title,
    };
  } catch (err) {
    return {
      title: "Movie Details",
    };
  }
}

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
