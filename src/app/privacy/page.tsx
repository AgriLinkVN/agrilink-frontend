import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">Chính sách bảo mật</h1>
            <p className="text-sm text-muted">Có hiệu lực từ ngày 01/01/2025</p>
          </div>

          <p className="text-sm text-muted leading-relaxed border-l-4 border-[#2D6A4F] pl-4">
            AgriLink Vietnam cam kết bảo vệ quyền riêng tư của người dùng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn sử dụng nền tảng AgriLink.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">1. Thông tin chúng tôi thu thập</h2>
            <p className="text-sm text-muted leading-relaxed">
              Chúng tôi thu thập các thông tin bạn cung cấp khi đăng ký tài khoản, bao gồm: họ và tên, số điện thoại, địa chỉ tỉnh/thành và thông tin địa chỉ giao hàng. Ngoài ra, chúng tôi ghi nhận dữ liệu giao dịch như lịch sử mua bán, sản phẩm đăng bán, đơn giá và thời gian giao dịch.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Dữ liệu hành vi trên nền tảng (trang đã xem, tìm kiếm, thời gian tương tác) cũng được thu thập tự động nhằm cải thiện trải nghiệm người dùng. Chúng tôi không thu thập thông tin thẻ ngân hàng — mọi giao dịch thanh toán được xử lý bởi đối tác cổng thanh toán (VNPay, MoMo, ZaloPay).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">2. Mục đích sử dụng thông tin</h2>
            <p className="text-sm text-muted leading-relaxed">
              Thông tin của bạn được sử dụng để cung cấp và vận hành các dịch vụ cốt lõi của AgriLink: xác minh danh tính qua OTP, kết nối người mua với người bán, xử lý đơn hàng và hỗ trợ chức năng truy xuất nguồn gốc bằng mã QR. Chúng tôi cũng sử dụng dữ liệu để gửi thông báo về biến động giá nông sản và các cập nhật tính năng mới.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Dữ liệu tổng hợp (không định danh cá nhân) được dùng để xây dựng chỉ số thị trường nông sản, hỗ trợ mô hình dự báo giá và cung cấp báo cáo cho cơ quan quản lý nhà nước theo quy định pháp luật Việt Nam.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">3. Chia sẻ thông tin với bên thứ ba</h2>
            <p className="text-sm text-muted leading-relaxed">
              AgriLink không bán thông tin cá nhân của người dùng cho bên thứ ba. Chúng tôi chỉ chia sẻ thông tin cần thiết với các đối tác dịch vụ như GHN, Viettel Post (địa chỉ giao hàng cho vận chuyển) và VNPay, MoMo (mã đơn hàng cho thanh toán). Các đối tác này bị ràng buộc bởi thỏa thuận bảo mật và chỉ được sử dụng thông tin cho mục đích cụ thể đã thỏa thuận.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Trong trường hợp được yêu cầu bởi cơ quan có thẩm quyền theo quy định pháp luật Việt Nam, chúng tôi có thể cung cấp thông tin theo lệnh của tòa án hoặc cơ quan điều tra có thẩm quyền.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">4. Bảo mật dữ liệu</h2>
            <p className="text-sm text-muted leading-relaxed">
              AgriLink áp dụng các biện pháp bảo mật kỹ thuật tiêu chuẩn ngành: toàn bộ kết nối sử dụng HTTPS/TLS 1.3, mật khẩu được băm bằng bcrypt và dữ liệu nhạy cảm được mã hóa AES-256 khi lưu trữ. Xác thực tài khoản được thực hiện qua OTP (One-Time Password) gửi đến số điện thoại đã đăng ký, có hiệu lực trong 5 phút.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Mặc dù chúng tôi nỗ lực bảo vệ thông tin của bạn, không có phương thức truyền dữ liệu qua Internet nào là tuyệt đối an toàn. Chúng tôi khuyến khích người dùng không chia sẻ mã OTP cho bất kỳ ai, kể cả nhân viên AgriLink.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">5. Quyền của người dùng</h2>
            <p className="text-sm text-muted leading-relaxed">
              Bạn có quyền truy cập, chỉnh sửa thông tin cá nhân bất kỳ lúc nào thông qua phần "Hồ sơ" trên ứng dụng AgriLink. Bạn cũng có quyền yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan — yêu cầu này sẽ được xử lý trong vòng 30 ngày làm việc.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Bạn có thể từ chối nhận thông báo marketing bất kỳ lúc nào thông qua cài đặt thông báo trong ứng dụng. Lưu ý rằng thông báo giao dịch (xác nhận đơn hàng, cập nhật vận chuyển) không thể tắt vì cần thiết cho hoạt động dịch vụ.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">6. Liên hệ</h2>
            <p className="text-sm text-muted leading-relaxed">
              Nếu bạn có câu hỏi hoặc yêu cầu liên quan đến chính sách bảo mật này, vui lòng liên hệ chúng tôi qua email{" "}
              <a href="mailto:hello@agrilink.vn" className="text-[#2D6A4F] font-medium hover:underline">
                hello@agrilink.vn
              </a>
              . Chúng tôi sẽ phản hồi trong vòng 3 ngày làm việc kể từ khi nhận được yêu cầu.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi quan trọng sẽ được thông báo trực tiếp đến người dùng qua số điện thoại hoặc thông báo trong ứng dụng trước ít nhất 15 ngày.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
