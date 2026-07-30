import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBuildSafeSiteUrl } from "@/config/runtime-config";
import { fetchProductDetail } from "@/lib/products-api";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductGallery } from "./_components/ProductGallery";
import { ProductInfo } from "./_components/ProductInfo";
import { ProductMeta } from "./_components/ProductMeta";
import { ContactButtons } from "./_components/ContactButtons";
import { SellerCard } from "./_components/SellerCard";
import { WishlistButton } from "./_components/WishlistButton";
import { ShareButton } from "./_components/ShareButton";
import { SimilarProducts } from "./_components/SimilarProducts";

const SITE_URL = getBuildSafeSiteUrl();

interface PageProps {
  params: Promise<{ id: string }>;
}

function productUrl(id: string) {
  return `${SITE_URL}/products/${id}`;
}

function primaryImage(product: Awaited<ReturnType<typeof fetchProductDetail>>) {
  if (!product) return null;
  const sorted = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  return sorted.find((image) => image.isPrimary) ?? sorted[0] ?? null;
}

function cleanDescription(value: string | null | undefined, fallback: string) {
  const text = (value ?? fallback).replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

function sellerDisplayName(product: NonNullable<Awaited<ReturnType<typeof fetchProductDetail>>>) {
  const seller = product.seller;
  if (!seller) return "AgriLink";
  if (seller.sellerType === "cooperative") {
    return seller.cooperativeName ?? seller.fullName ?? "Hợp tác xã AgriLink";
  }
  if (seller.sellerType === "supplier") {
    return seller.companyName ?? seller.fullName ?? "Nhà cung cấp AgriLink";
  }
  return seller.farmName ?? seller.fullName ?? "Hộ sản xuất AgriLink";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductDetail(id);
  if (!product) return { title: "Không tìm thấy sản phẩm | AgriLink" };

  const title = `${product.name} | AgriLink`;
  const description = cleanDescription(
    product.description,
    `${product.name} trên AgriLink Vietnam`,
  );
  const url = productUrl(id);
  const image = primaryImage(product);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "AgriLink",
      type: "website",
      images: image
        ? [
            {
              url: image.imageUrl,
              alt: image.altText ?? product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image.imageUrl] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await fetchProductDetail(id);

  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: cleanDescription(product.description, product.name),
    image: product.images.map((image) => image.imageUrl),
    sku: product.sku ?? undefined,
    category: product.category?.name,
    brand: {
      "@type": "Brand",
      name: "AgriLink",
    },
    offers: {
      "@type": "Offer",
      url: productUrl(id),
      priceCurrency: "VND",
      price: Number(product.pricePerUnit),
      availability:
        Number(product.availableQuantity) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: sellerDisplayName(product),
      },
    },
  };

  // Hide non-active products from public (owner view handled in IT3+ /dashboard)
  if (product.status !== "active") {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-xl font-semibold">Sản phẩm không khả dụng</h1>
          <p className="mt-2 text-muted">
            Sản phẩm này hiện không được hiển thị công khai.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pb-24 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT: Gallery */}
          <div className="md:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* RIGHT: Info + Sticky sidebar (desktop) */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Info block — wraps breadcrumb + name + price + badges + description */}
                <ProductInfo product={product} />
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <WishlistButton productId={product.id} />
                <ShareButton productName={product.name} />
              </div>
            </div>

            <ProductMeta product={product} />

            {/* Sticky CTA sidebar (desktop) */}
            <div className="md:sticky md:top-20 space-y-4">
              <div className="hidden md:block">
                <ContactButtons
                  phone={product.seller?.phone}
                  sellerName={product.seller?.fullName}
                />
              </div>
              <SellerCard seller={product.seller} />
            </div>
          </div>
        </div>

        {/* Similar products (lazy-loaded) */}
        <SimilarProducts
          categoryId={product.category?.id ?? null}
          excludeId={product.id}
        />
      </main>

      {/* Mobile floating contact bar */}
      <ContactButtons phone={product.seller?.phone} variant="mobile-bar" />

      <Footer />
    </div>
  );
}
