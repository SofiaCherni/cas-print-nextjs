import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import ProductGrid from "@/components/ProductGrid";
import { getPopularProducts, PRINT_CATEGORIES } from "@/lib/data";

export default function HomePage() {
  const popular = getPopularProducts(4);

  return (
    <main>
      {/* Блок 1 — HERO */}
      <section className="relative h-[96vh] min-h-[560px] -mt-[88px] flex items-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/15 via-bg/5 to-bg/85" />
        <div className="relative z-10 w-full px-5 md:px-8 pb-16 md:pb-20">
          <h1 className="font-display font-black leading-[0.96] tracking-tight text-[38px] sm:text-6xl md:text-8xl max-w-4xl mb-5">
            ОДЯГ, ЯКИЙ
            <br />
            ГОВОРИТЬ ЗА ТЕБЕ
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-paper/85 mb-8">
            Футболки та худі з готовими принтами або твоїм власним дизайном.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Button href="/catalog" variant="accent">НАШІ ТОВАРИ</Button>
            <Button href="/custom-print" variant="ghost">СТВОРИТИ СВІЙ</Button>
          </div>
        </div>
        <div className="absolute right-5 md:right-8 bottom-7 z-10 flex flex-col items-center gap-2 text-[10px] tracking-[0.15em] text-paper/70">
          SCROLL
          <span className="w-px h-9 bg-paper/40" />
        </div>
      </section>

      {/* Блок 2 — ОБЕРИ СВІЙ ПРИНТ */}
      <section className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-[1360px] mx-auto">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
              ОБЕРИ СВІЙ ПРИНТ
            </h2>
            <Button href="/catalog" variant="ghost" className="px-5 py-3">
              ПЕРЕГЛЯНУТИ ВСІ ПРИНТИ
            </Button>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-14">
            {PRINT_CATEGORIES.map((c) => (
              <Link
                key={c.value}
                href={`/catalog?printCategory=${c.value}`}
                className="px-5 py-2.5 rounded-full text-sm font-semibold border border-line text-muted hover:text-paper hover:border-paper"
              >
                {c.label}
              </Link>
            ))}
          </div>
          <ProductGrid products={popular} />
        </div>
      </section>

      {/* Блок 3 — ОБЕРИ РІЧ */}
      <section className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-[1360px] mx-auto">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight mb-10">
            ОБЕРИ РІЧ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0.5">
            {[
              { label: "ФУТБОЛКИ", href: "/catalog/t-shirts" },
              { label: "СВІТШОТИ", href: "/catalog/sweatshirts" },
              { label: "ХУДІ", href: "/catalog/hoodies" },
              { label: "ІНШІ ТОВАРИ", href: "/catalog/basics" }
            ].map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="group relative aspect-[4/5] flex items-end p-6 bg-gradient-to-br from-[#201f1b] to-bg overflow-hidden"
              >
                <h3 className="relative font-display font-extrabold text-2xl group-hover:text-accent transition-colors">
                  {c.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 4 — ПОПУЛЯРНЕ */}
      <section className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-[1360px] mx-auto">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">ПОПУЛЯРНЕ</h2>
            <Button href="/catalog" variant="ghost" className="px-5 py-3">
              ПЕРЕГЛЯНУТИ ВСІ ТОВАРИ
            </Button>
          </div>
          <ProductGrid products={popular} />
        </div>
      </section>

      {/* Блок 5 — СТВОРИ ВЛАСНИЙ */}
      <section className="grid md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[340px] md:min-h-[440px] bg-gradient-to-br from-[#1a1917] to-bg flex items-center justify-center">
          <span className="font-display font-black text-sm tracking-[0.1em] text-paper/20">
            CUSTOM DESIGN
          </span>
        </div>
        <div className="bg-bgSoft flex flex-col justify-center p-10 md:p-16">
          <p className="font-display font-semibold text-2xl text-muted m-0">НЕ ЗНАЙШОВ СВІЙ?</p>
          <p className="font-display font-black text-4xl md:text-6xl tracking-tight my-1.5 mb-6">
            СТВОРИ ВЛАСНИЙ.
          </p>
          <p className="text-paper/75 leading-relaxed max-w-sm mb-8">
            Маєш власне фото, напис, ілюстрацію чи логотип? Надішли нам — і ми нанесемо його на одяг.
          </p>
          <Button href="/custom-print" variant="solid" className="w-fit">
            ЗАМОВИТИ ВЛАСНИЙ ПРИНТ
          </Button>
        </div>
      </section>

      {/* Блок 6 — ЯКІСТЬ ПРИНТА */}
      <section className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-[1360px] mx-auto">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight max-w-2xl mb-10">
            ПРИНТ, ЯКИЙ ХОЧЕТЬСЯ РОЗГЛЯДАТИ
          </h2>
          <div className="grid md:grid-cols-[1.1fr_0.9fr] border border-line">
            <div className="min-h-[280px] md:min-h-[340px] bg-gradient-to-br from-[#1c1b18] to-bg flex items-center justify-center">
              <span className="font-display font-black text-sm tracking-[0.1em] text-paper/20">
                MACRO PRINT DETAIL
              </span>
            </div>
            <div className="p-8 md:p-12 flex items-center">
              <div className="flex flex-wrap gap-9">
                {["ЯКІСНИЙ ДРУК", "ДЕТАЛЬНЕ ЗОБРАЖЕННЯ", "СТІЙКІСТЬ ДО ПРАННЯ"].map((t) => (
                  <div key={t} className="text-[13px] font-bold tracking-wide pt-3.5 border-t border-line min-w-[150px]">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 7 — ЯК ЦЕ ПРАЦЮЄ */}
      <section className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-[1360px] mx-auto">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight mb-10">
            ЯК ЦЕ ПРАЦЮЄ
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-2 -mx-5 px-5 md:mx-0 md:px-0">
            {[
              { n: "01", t: "ОБИРАЄШ ПРИНТ", d: "Обираєш готовий дизайн із каталогу або завантажуєш власний." },
              { n: "02", t: "ОБИРАЄШ РІЧ", d: "Футболка, худі чи базова річ — вирішуєш, на що нанести принт." },
              { n: "03", t: "ОБИРАЄШ РОЗМІР І КОЛІР", d: "Підбираєш фасон, розмір та колір за візуальною палітрою." },
              { n: "04", t: "ЗАМОВЛЯЄШ", d: "Оформлюєш замовлення — решту зробимо ми." }
            ].map((s) => (
              <div key={s.n} className="flex-none w-64 pt-8 border-t border-line">
                <span className="font-display font-extrabold text-sm text-accent">{s.n}</span>
                <h4 className="font-display font-bold text-lg my-3">{s.t}</h4>
                <p className="text-[13px] text-muted leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 8 — НОСИ СВОЄ */}
      <section className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-[1360px] mx-auto">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight mb-10">
            НОСИ СВОЄ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[110px] md:auto-rows-[120px] gap-0.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br from-[#1c1b18] to-bg ${
                  i === 0 ? "md:col-span-3 md:row-span-3 col-span-1 row-span-2" :
                  i === 3 ? "md:col-span-4 md:row-span-3 col-span-1 row-span-2" :
                  "md:col-span-3 md:row-span-2 col-span-1 row-span-2"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Блок 9 — ФІНАЛЬНИЙ CTA */}
      <section className="bg-black text-center py-28 md:py-36 px-5">
        <h2 className="font-display font-black text-4xl md:text-7xl tracking-tight mb-9">
          ЗНАЙДИ ТЕ, ЩО ТВОЄ
        </h2>
        <div className="flex flex-wrap gap-3.5 justify-center">
          <Button href="/catalog" variant="solid">ПЕРЕГЛЯНУТИ КАТАЛОГ</Button>
          <Button href="/custom-print" variant="ghost">СТВОРИТИ СВІЙ ПРИНТ</Button>
        </div>
      </section>
    </main>
  );
}
