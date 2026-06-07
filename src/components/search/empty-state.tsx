import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onReset?: () => void;
}

export function EmptyState({ onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <PackageSearch size={48} className="text-muted-soft mb-4" />
      <h3 className="text-base font-semibold text-ink mb-1">
        Không tìm thấy sản phẩm nào
      </h3>
      <p className="text-sm text-muted mb-5 max-w-sm">
        Thử điều chỉnh bộ lọc hoặc từ khoá tìm kiếm để có nhiều kết quả hơn.
      </p>
      {onReset && (
        <Button variant="secondary" onClick={onReset}>
          Xoá bộ lọc
        </Button>
      )}
    </div>
  );
}
