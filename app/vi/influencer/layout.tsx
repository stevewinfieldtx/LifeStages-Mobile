import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Stages AI cho Influencer - Nền Tảng Ứng Dụng Kinh Thánh Thương Hiệu Riêng",
  description: "Nền tảng tĩnh nguyện Kinh Thánh thương hiệu riêng cho influencer đức tin. Ứng dụng tùy chỉnh của riêng bạn với 50% doanh thu đăng ký.",
  openGraph: {
    title: "Life Stages AI cho Influencer",
    description: "Biến tầm ảnh hưởng của bạn thành tác động Vương quốc. Thương hiệu của bạn, giọng nói của bạn, 50% doanh thu.",
    type: "website",
    locale: "vi_VN",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
