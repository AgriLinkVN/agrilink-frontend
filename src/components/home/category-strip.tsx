import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    label: "Lúa gạo",
    count: 234,
    href: "/marketplace?category=lua-gao",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
    color: "from-amber-800/65",
  },
  {
    label: "Rau củ",
    count: 512,
    href: "/marketplace?category=rau-cu",
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&q=80",
    color: "from-green-800/65",
  },
  {
    label: "Trái cây",
    count: 389,
    href: "/marketplace?category=trai-cay",
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&q=80",
    color: "from-orange-700/65",
  },
  {
    label: "Thủy sản",
    count: 156,
    href: "/marketplace?category=thuy-san",
    image: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80",
    color: "from-blue-900/65",
  },
  {
    label: "Gia súc",
    count: 98,
    href: "/marketplace?category=gia-suc",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80",
    color: "from-stone-800/65",
  },
  {
    label: "Nông sản khô",
    count: 201,
    href: "/marketplace?category=nong-san-kho",
    image: "https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?w=600&q=80",
    color: "from-yellow-900/65",
  },
];

export function CategoryStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="flex gap-3 overflow-x-auto pb-2 category-scroll">
        {CATEGORIES.map(({ label, count, href, image, color }) => (
          <Link
            key={label}
            href={href}
            className="group relative rounded-2xl overflow-hidden w-48 sm:w-56 h-32 sm:h-36 shrink-0 cursor-pointer"
          >
            {/* Background image */}
            <Image
              src={image}
              alt={label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 33vw, 16vw"
            />

            {/* Gradient overlay — always present, darkens on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${color} to-transparent transition-opacity duration-300 opacity-70 group-hover:opacity-90`}
            />

            {/* Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 px-2 text-center">
              <p className="text-white text-xs font-bold leading-tight drop-shadow-sm">{label}</p>
              <p className="text-white/75 text-[10px] mt-0.5">{count} sản phẩm</p>
            </div>

            {/* Hover ring */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-primary ring-offset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
