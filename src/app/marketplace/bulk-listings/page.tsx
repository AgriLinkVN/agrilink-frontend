import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PublicBulkListings } from './components/PublicBulkListings';

export const metadata = {
  title: 'Lô hàng lớn từ HTX | AgriLink',
};

export default function MarketplaceBulkListingsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Lô hàng lớn từ HTX</h1>
          <p className="text-sm text-muted mt-1">
            Mua sỉ trực tiếp từ các hợp tác xã trên toàn quốc — chứng nhận VietGAP /
            Hữu cơ / GlobalGAP.
          </p>
        </header>
        <PublicBulkListings />
      </div>
      <Footer />
    </div>
  );
}
