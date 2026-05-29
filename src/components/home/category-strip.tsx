import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    label: "Lúa gạo",
    count: 234,
    href: "/marketplace?category=lua-gao",
    image: "https://images.unsplash.com/photo-1651981350249-6173caeeb660?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "from-amber-900/60",
  },
  {
    label: "Rau củ",
    count: 512,
    href: "/marketplace?category=rau-cu",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    color: "from-green-800/60",
  },
  {
    label: "Trái cây",
    count: 389,
    href: "/marketplace?category=trai-cay",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80",
    color: "from-orange-700/60",
  },
  {
    label: "Thủy sản",
    count: 156,
    href: "/marketplace?category=thuy-san",
    image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80",
    color: "from-blue-900/60",
  },
  {
    label: "Gia súc",
    count: 98,
    href: "/marketplace?category=gia-suc",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80",
    color: "from-stone-800/60",
  },
  {
    label: "Nông sản khô",
    count: 201,
    href: "/marketplace?category=nong-san-kho",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    color: "from-yellow-900/60",
  },
];

export function CategoryStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {CATEGORIES.map(({ label, count, href, image, color }) => (
          <Link
            key={label}
            href={href}
            className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer"
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
