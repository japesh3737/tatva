
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const articles = [
  {
    category: "DESIGN PHILOSOPHY",
    title: "The Art of Intentional Living",
    excerpt:
      "Discover how thoughtful design choices can transform a house into a home that reflects your personality and lifestyle.",
    content:
      "Intentional living begins with understanding how you use your space. Natural light, carefully selected materials, and thoughtful layouts can create a home that feels personal, comfortable, and timeless.",
    date: "Design Journal",
  },
  {
    category: "MATERIALS & CRAFT",
    title: "The Beauty of Natural Materials",
    excerpt:
      "Explore the warmth and character that natural materials bring to contemporary interiors.",
    content:
      "Wood, stone, linen, and other natural materials add depth and texture to interiors. Combining these elements with care creates a balanced atmosphere that feels warm and welcoming.",
    date: "Materials & Craft",
  },
  {
    category: "SPACES & LIFESTYLE",
    title: "Designing Spaces That Feel Like You",
    excerpt:
      "Learn how colour, lighting, furniture, and layout can make a space feel truly yours.",
    content:
      "Great interior design starts with how people live. Thoughtful lighting, practical furniture arrangements, and meaningful details help create spaces that balance functionality with individual character.",
    date: "Spaces & Lifestyle",
  },
];

export const metadata = {
  title: "Blog | Tatva Studio",
  description:
    "Ideas, inspiration, and perspectives on architecture and interior design from Tatva Studio.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#3B0700] text-[#F6EAD8] bg-tatva-grain">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#3B0700]/90 backdrop-blur-md border-b border-[#F6EAD8]/10 px-6 sm:px-12 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59B6D] hover:text-[#F6EAD8] transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <span
          className="text-sm font-semibold tracking-[0.3em] uppercase"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Tatva Studio
        </span>
      </nav>

      {/* Blog Introduction */}
      <section className="pt-36 pb-16 px-6 sm:px-12 max-w-[1600px] mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium mb-4">
            Journal • Ideas • Inspiration
          </span>

          <h1
            className="text-4xl sm:text-6xl font-normal tracking-tight text-[#F6EAD8] mb-6"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            The Tatva Journal
          </h1>

          <div className="w-16 h-[1px] bg-[#C59B6D]/50 mx-auto mb-6" />

          <p className="text-sm sm:text-base text-[#F6EAD8]/80 font-light leading-relaxed">
            Discover ideas, materials, and perspectives that shape the way we
            experience architecture and interior spaces.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="px-6 sm:px-12 pb-24 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#F6EAD8]/15" />
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-[#C59B6D]">
            Latest Articles
          </h2>
          <div className="h-px flex-1 bg-[#F6EAD8]/15" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.title}
              className="group flex flex-col border border-[#F6EAD8]/15 bg-[#4A0A00]/70 p-7 sm:p-8 transition-colors duration-300 hover:border-[#C59B6D]/60"
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C59B6D] mb-5">
                {article.category}
              </span>

              <h3
                className="text-2xl font-normal leading-snug text-[#F6EAD8] mb-4"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {article.title}
              </h3>

              <p className="text-sm text-[#F6EAD8]/75 font-light leading-7">
                {article.excerpt}
              </p>

              <details className="mt-6 border-t border-[#F6EAD8]/15 pt-5">
                <summary className="cursor-pointer list-none text-[10px] uppercase tracking-[0.2em] text-[#C59B6D] hover:text-[#F6EAD8] transition-colors">
                  Read Article <span className="ml-2">+</span>
                </summary>

                <p className="mt-4 text-sm text-[#F6EAD8]/80 font-light leading-7">
                  {article.content}
                </p>

                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#C59B6D]/80">
                  {article.date}
                </p>
              </details>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#F6EAD8]/15 px-6 sm:px-12 py-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.25em] text-[#C59B6D] hover:text-[#F6EAD8] transition-colors"
          >
            Tatva Studio
          </Link>

          <p className="text-xs text-[#F6EAD8]/60 text-center">
            Thoughtful spaces. Timeless design.
          </p>

          <Link
            href="/gallery"
            className="text-xs uppercase tracking-[0.2em] text-[#F6EAD8]/80 hover:text-[#C59B6D] transition-colors"
          >
            Explore Gallery
          </Link>
        </div>
      </footer>
    </main>
  );
}
