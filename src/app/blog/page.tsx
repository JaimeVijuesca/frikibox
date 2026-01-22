import Link from 'next/link';
import { getAllPosts } from '../lib/post';
import Image from 'next/image';

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="container mx-auto py-24 px-4 md:px-6">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Blog FrikiBox</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2">
          Descubre artículos, ideas y noticias sobre cajas frikis, anime, series y cultura geek.
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col"
          >
            {/* Si quieres añadir imagen de portada, puedes usar post.data.image */}
            {post.data.image && (
              <div className="relative w-full h-48">
                <Image
                  src={post.data.image}
                  alt={post.data.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
              <header className="mb-3">
                <h2 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.data.title}</Link>
                </h2>
                <p className="text-sm text-muted-foreground">{post.data.date}</p>
              </header>

              <p className="text-muted-foreground flex-grow">{post.data.description}</p>

              <footer className="mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block text-primary font-medium hover:underline transition-colors"
                >
                  Leer más →
                </Link>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
