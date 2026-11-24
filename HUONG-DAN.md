# DUCK//TAI — Portfolio bản Blue shift

Phong cách: nền xanh navy phát sáng, chữ kim loại, viên kính chữ pixel — kết hợp chi tiết phần mềm dựng phim
(timecode, track V1/V2/A1, playhead, safe-area, IN/OUT, thư mục Media bin).

## Hiệu ứng & UI phần mềm dựng (assets/css/fx.css + assets/js/fx.js)

- **Intro "cắt mở"** (~1 giây: clip bật vào track → playhead quét → Razor cắt → hai nửa màn hình tách ra): chỉ chạy 1 lần mỗi phiên ở trang chủ; bấm/Esc để bỏ qua.
  Muốn intro dài/ngắn hơn: đổi `CUT_AT` (mili-giây, mặc định 800) trong `runIntro` của `assets/js/fx.js`.
- **Thanh Tools** (màn hình máy tính): `V` chọn · `C` dao cắt (bấm đâu cũng “cắt” tại timecode) · `H` bàn tay kéo trang · `?` bảng phím tắt.
- **Tua trang `J` / `K` / `L`** như tua video (bấm nhiều lần để 1x → 2x → 4x).
- **Lumetri Color** ở trang chủ: thanh trượt Exposure/Contrast/Saturation/Temperature/Vignette, 6 LUT, kéo vạch so sánh trước/sau, scope RGB, chọn 2 clip (phòng gym, biển mây Y Tý).
  Đổi/thêm ảnh: sửa danh sách `clips` trong `assets/js/home.js` (ảnh 16:9, nên dùng ảnh không có chữ).
- **Theme "Premiere" (đang dùng)** nằm trong `assets/css/premiere.css`, nạp sau cùng: nền xám trung tính, panel phẳng,
  một màu nhấn xanh Adobe, clip timeline theo bảng màu nhãn Premiere, tắt cực quang/hạt phim/glitch/ánh kim/liquid glass.
  Bỏ dòng nạp `premiere.css` ở 3 trang HTML là quay về bản xanh navy nhiều hiệu ứng (depth.css).
- Đồng hồ VU nhảy theo tốc độ cuộn, nút transport, chip chuyển cảnh (Cross Dissolve…), thanh màu SMPTE, export bar khi gửi brief.
- Nền cực quang, hạt phim, chữ kim loại có vệt sáng, glitch RGB chữ EDIT, đèn rọi theo chuột, nghiêng 3D, đếm số.
- Tất cả tự tắt khi máy bật “giảm chuyển động”; con trỏ/Tools ẩn trên điện thoại.

Khi sửa CSS/JS mà trình duyệt vẫn hiện bản cũ: tăng số `?v=3` trong thẻ `<link>`/`<script>` của 3 trang (hoặc Ctrl+F5).

## Cấu trúc

```
index.html         Trang chủ: hero, giới thiệu, Media bin (thư mục), 3 case study, dịch vụ + quy trình, FAQ, liên hệ
works.html         Toàn bộ dự án (lọc + tìm). Mở sẵn một thể loại: works.html?cat=Gaming
preset.html        Bán Preset Pack + thanh toán
assets/js/data.js  ← NỘI DUNG: video, case study (kèm tags), dịch vụ, giá, feedback, liên hệ
assets/js/main.js  Dùng chung: timeline dock, timecode, trình phát video, menu
assets/js/home.js  Dựng trang chủ từ data.js
assets/css/style.css
assets/img/        Ảnh đã nén + og.jpg (ảnh xem trước khi chia sẻ link)
```

## Việc thường làm (chỉ sửa `assets/js/data.js`)

- **Thêm video:** thêm một dòng vào `longForm` (16:9) hoặc `shortForm` (9:16): `['Tên video', 'ID_YOUTUBE', 'Thể loại'],`
  Video tự vào đúng thư mục trong Media bin theo thể loại.
- **Đổi showreel:** sửa `showreel.id`.
- **Case study:** sửa `brief`, `role`, `tags`; điền `result` (ví dụ `'1,2M lượt xem'`) thì ô Kết quả sẽ hiện.
- **Giá:** sửa `price` trong `services`, ví dụ `'Từ 300.000₫'`.
- **Feedback khách:** thêm vào `testimonials` — mục Feedback tự hiện.

Số slot Preset: sửa `data-left` / `data-total` trên thẻ `#slots` trong `preset.html` (hiện: còn 9 / 50).

Demo kéo thả trên trang Preset: `assets/js/preset-demo.js` (danh sách preset trong mảng `fx`, dải tên hiệu ứng trong mảng `names`)
và `assets/css/preset.css` (các hiệu ứng xem trước `fx-zoom`, `fx-shake`, `fx-glitch`, `fx-whip`, `fx-flash`, `fx-speed`).

## Khi đưa lên tên miền

Đổi `og:image` (3 trang) thành đường dẫn đầy đủ, ví dụ `https://tenmien.com/assets/img/og.jpg`.

## Xem thử trên máy

```
python -m http.server 5518
```

rồi mở http://127.0.0.1:5518 (mở thẳng file vẫn chạy, nhưng YouTube có thể chặn phát video khi dùng `file://`).
