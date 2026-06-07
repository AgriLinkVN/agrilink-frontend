import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">Điều khoản sử dụng</h1>
            <p className="text-sm text-muted">Có hiệu lực từ ngày 01/01/2025</p>
          </div>

          <p className="text-sm text-muted leading-relaxed border-l-4 border-[#2D6A4F] pl-4">
            Bằng cách truy cập hoặc sử dụng nền tảng AgriLink Vietnam, bạn đồng ý bị ràng buộc bởi các điều khoản sử dụng dưới đây. Vui lòng đọc kỹ trước khi tạo tài khoản hoặc thực hiện giao dịch.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">1. Điều khoản chung</h2>
            <p className="text-sm text-muted leading-relaxed">
              AgriLink Vietnam cung cấp nền tảng số kết nối nông dân, hợp tác xã, doanh nghiệp thu mua và nhà phân phối trong chuỗi nông sản Việt Nam. AgriLink đóng vai trò là trung gian công nghệ — chúng tôi không trực tiếp mua, bán hoặc sở hữu bất kỳ sản phẩm nông nghiệp nào được đăng trên nền tảng.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Nền tảng được cung cấp theo hiện trạng (&quot;as-is&quot;). AgriLink có quyền tạm dừng hoặc chấm dứt dịch vụ để bảo trì, nâng cấp hệ thống mà không cần thông báo trước. Người dùng cần đủ 18 tuổi hoặc có sự đồng ý của người giám hộ hợp pháp để sử dụng nền tảng.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">2. Tài khoản người dùng</h2>
            <p className="text-sm text-muted leading-relaxed">
              Tài khoản AgriLink được tạo và xác thực thông qua số điện thoại Việt Nam bằng mã OTP. Mỗi số điện thoại chỉ được liên kết với một tài khoản duy nhất. Người dùng chịu hoàn toàn trách nhiệm bảo mật tài khoản của mình — bao gồm không chia sẻ mã OTP, không để thiết bị đăng nhập sẵn cho người khác sử dụng.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Mọi hành động thực hiện từ tài khoản của bạn (đăng sản phẩm, thực hiện giao dịch, gửi tin nhắn) đều được coi là hành động của chủ tài khoản. Nếu phát hiện truy cập trái phép, hãy liên hệ ngay với chúng tôi qua hello@agrilink.vn để khóa tài khoản khẩn cấp.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">3. Quy tắc đăng sản phẩm</h2>
            <p className="text-sm text-muted leading-relaxed">
              Người bán cam kết cung cấp thông tin trung thực và chính xác về sản phẩm, bao gồm: tên sản phẩm, xuất xứ, phương pháp canh tác, chứng nhận (VietGAP, GlobalGAP nếu có), giá bán và số lượng thực tế có thể giao. Hình ảnh đăng tải phải là hình thực của sản phẩm, không được sử dụng ảnh giả mạo hoặc ảnh chỉnh sửa gây hiểu lầm.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Nghiêm cấm đăng bán hàng giả, hàng kém chất lượng, sản phẩm không rõ nguồn gốc, hoặc các sản phẩm bị cấm theo quy định pháp luật Việt Nam. AgriLink có quyền gỡ bỏ sản phẩm vi phạm và khóa tài khoản người bán mà không cần thông báo trước trong trường hợp vi phạm nghiêm trọng.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">4. Giao dịch & Thanh toán</h2>
            <p className="text-sm text-muted leading-relaxed">
              Mọi giao dịch trên AgriLink được thực hiện giữa người mua và người bán. Thanh toán có thể thực hiện qua VNPay, MoMo, ZaloPay hoặc chuyển khoản ngân hàng. Tiền được giữ tạm thời bởi hệ thống escrow của AgriLink và giải ngân cho người bán sau khi người mua xác nhận đã nhận hàng đạt chất lượng, hoặc tự động sau 48 giờ kể từ khi giao hàng thành công.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Trong trường hợp tranh chấp, AgriLink đóng vai trò trung gian hòa giải. Người mua có quyền khiếu nại trong vòng 24 giờ sau khi nhận hàng nếu sản phẩm không đúng mô tả. AgriLink sẽ xem xét bằng chứng từ cả hai phía và đưa ra phán quyết trong vòng 3 ngày làm việc.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">5. Giới hạn trách nhiệm của AgriLink</h2>
            <p className="text-sm text-muted leading-relaxed">
              AgriLink không chịu trách nhiệm về chất lượng thực tế của sản phẩm, sự chậm trễ vận chuyển do đối tác logistics, hoặc thiệt hại phát sinh từ giao dịch giữa người dùng với nhau ngoài phạm vi nền tảng. Trách nhiệm tối đa của AgriLink trong mọi trường hợp được giới hạn ở mức phí dịch vụ mà người dùng đã trả trong 12 tháng gần nhất.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              AgriLink không đảm bảo nền tảng hoạt động liên tục không gián đoạn. Chúng tôi sẽ nỗ lực duy trì uptime tối thiểu 99% mỗi tháng, nhưng các sự cố ngoài tầm kiểm soát (thiên tai, sự cố hạ tầng mạng quốc gia) được miễn trừ trách nhiệm.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink">6. Thay đổi điều khoản</h2>
            <p className="text-sm text-muted leading-relaxed">
              AgriLink có quyền cập nhật các điều khoản sử dụng này bất kỳ lúc nào để phản ánh thay đổi trong dịch vụ, yêu cầu pháp lý hoặc chính sách công ty. Mọi thay đổi quan trọng sẽ được thông báo đến người dùng qua SMS hoặc thông báo trong ứng dụng ít nhất 15 ngày trước khi có hiệu lực.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Việc tiếp tục sử dụng AgriLink sau ngày thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các điều khoản mới. Nếu không đồng ý, bạn có quyền xóa tài khoản trước ngày hiệu lực mà không phát sinh bất kỳ nghĩa vụ nào. Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ{" "}
              <a href="mailto:hello@agrilink.vn" className="text-[#2D6A4F] font-medium hover:underline">
                hello@agrilink.vn
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
