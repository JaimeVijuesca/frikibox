import { getPost } from "../../lib/post";

interface Props {
  params: { slug: string };
}

export default async function PostPage({ params }: Props) {
  const { slug } = params;
  const { data, contentHtml } = await getPost(slug);

  return (
    <article className="container mx-auto py-24 max-w-4xl px-4 md:px-6">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
        <p className="text-muted-foreground mb-2">{data.description}</p>
        {data.date && <time className="text-sm text-muted-foreground">{data.date}</time>}
      </header>

      {/* Contenido con estilos de blog */}
      <section
        className="prose prose-lg md:prose-xl mx-auto mb-16 prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* CTA o enlaces internos */}
      <section className="text-center mt-16">
        <p className="mb-4 font-semibold">¿Te gustó esta FrikiBox?</p>
        <a
          href="/personalize"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Personaliza tu FrikiBox
        </a>
      </section>
    </article>
  );
}
