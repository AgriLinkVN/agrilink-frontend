import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PublicBulkListingDetail } from './components/PublicBulkListingDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MarketplaceBulkListingDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PublicBulkListingDetail id={id} />
      </div>
      <Footer />
    </div>
  );
}
