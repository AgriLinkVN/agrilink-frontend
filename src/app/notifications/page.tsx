import { NotificationsList } from './components/NotificationsList';

export const metadata = {
  title: 'Thông báo | AgriLink',
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Thông báo</h1>
          <p className="text-sm text-muted mt-1">
            Toàn bộ thông báo của bạn — đơn hàng, đánh giá, quảng cáo, hệ thống.
          </p>
        </header>
        <NotificationsList />
      </div>
    </div>
  );
}
