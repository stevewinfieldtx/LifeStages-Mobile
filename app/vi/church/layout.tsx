import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Stages AI cho Hội Thánh - Nền Tảng Ứng Dụng Kinh Thánh Thương Hiệu Riêng",
  description: "Nền tảng tĩnh nguyện Kinh Thánh thương hiệu riêng cho hội thánh. Thay thế YouVersion bằng ứng dụng tùy chỉnh của riêng bạn với trí tuệ mục vụ, tích hợp bài giảng và cá nhân hóa AI.",
  openGraph: {
    title: "Life Stages AI cho Hội Thánh",
    description: "Từ Bục Giảng Đến Cá Nhân Hóa. Thương hiệu của bạn, giọng nói của bạn, ADN thần học của bạn.",
    type: "website",
    locale: "vi_VN",
  },
}

export default function VietnameseChurchLayout({ children }: { children: React.ReactNode }) {
  return children
}
