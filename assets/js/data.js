/*
 * DỮ LIỆU PORTFOLIO — chỉ cần sửa file này để cập nhật nội dung.
 * Dùng file .js (không phải .json) để site chạy được cả khi mở trực tiếp bằng file://
 *
 * Mỗi video: [tên, id, thể loại, nền tảng?, ảnh thumbnail tự chọn?]
 *   - id YouTube: phần sau "v=" hoặc sau "/shorts/"
 *   - nền tảng mặc định là 'youtube'; với TikTok ghi 'tiktok' và id là số trong link video
 */
window.PORTFOLIO = {
  // Video showreel ở đầu trang chủ. Khi có showreel riêng, thay id YouTube tại đây.
  showreel: { title: 'Showreel', id: '3Dj5D4r3oys' },

  // Màu nhãn theo thể loại — bảng màu label của Premiere (Violet, Caribbean, Rose, Mango…)
  categories: {
    'Bất động sản': '#2fb592',
    'Sự kiện': '#d0688f',
    'Podcast': '#d98a35',
    'Gaming': '#9a82d6',
    'Gaming Shorts': '#9a82d6',
    'Khóa học': '#2f97cf',
    'Giáo dục': '#7a8bd6',
    'Review': '#5c9e3d',
    'Quảng cáo': '#c486d6'
  },

  longForm: [
    ['Blanca City by Sungroup - Vũng Tàu', '3Dj5D4r3oys', 'Bất động sản'],
    ['HYROX HÀ NỘI THÁNG 3 NĂM 2027', 'Wza62cbrGxc', 'Sự kiện'],
    ['TO BECOME THE PERSON YOU WANT...', 'egJZQNY6ih4', 'Podcast'],
    ['1 THIEF, 1 STUPID...', 'WI7IM9v5_Us', 'Gaming'],
    ['Mình Thấy Có Gì Đó Mặn Mặn', 'UTr0hje3nVs', 'Gaming'],
    ['Khi Bọn Tôi Bị Xích Cùng Nhau', 'eQlimopzHuI', 'Gaming'],
    ['Prison Break With A Spoon', 'SZZNwGABdMo', 'Gaming'],
    ['IS THIS HUMAN OR DEMON!?', 'fO2q-X9e-8A', 'Gaming'],
    ['Tôi tìm thấy chuột HAMSTER trong Minecraft !!', '87nOHFuZM9U', 'Gaming'],
    ['Đứa nào vừa ** trong hồ bơi !?', '5BHW05px8UM', 'Gaming'],
    ['lần đầu ngủ cùng nhau của bọn mình...', 'PvZd15_FqxE', 'Gaming'],
    ['Game này làm tui rơi nước mắt...', 'DZHfAqcMPfk', 'Gaming'],
    ['Các thầy trừ tà tài ba tô cơm', 'dZSNaRgHubA', 'Gaming'],
    ['Đừng để bị game này đánh lừa', '81upiCtob6E', 'Gaming'],
    ['Khóa học Chủ Quán Xây Kênh', 'ZvFef7cFwyM', 'Khóa học'],
    ['Cách Quay Video - Khoá Học Học Chủ Quán', 'vLzuJgmyqs0', 'Khóa học'],
    ['Cách Tìm Kiếm Ý Tưởng', 'BNDqNsMaUKY', 'Khóa học'],
    ['Mẹo Quay Video', 'qkbitmIkEMk', 'Khóa học'],
    ['DIPLOMATS - Giải Nhất CLB Tiếng Anh', 'Tmywx-pe028', 'Giáo dục'],
    ['RECAP ĐÁM CƯỚI - Cầu Hôn Tại CGV', 'b5Iyd58AKJg', 'Sự kiện'],
    ['Podcast - DuckTai Editor', 'RFFZ5yHiuu0', 'Podcast'],
    ['Hồi Ký - PODCAST', 'LNkkPDIzc6U', 'Podcast'],
    ['Linh Miêu Ba Sắc - PODCAST', 'xdnUnKyfU-w', 'Podcast'],
    ['Buffet Gành Hào Vũng Tàu', 'R4Yr-ZuHwEo', 'Review'],
    ['Vlog 3: Cùng Taikonn khám phá Thượng Hải và DisneyLand', 'XbWvekYLxrg', 'Review'],
    ['Y TY - Vlog StoryTelling', 'xTO1-SYuYGs', 'Review'],
    ['Dấu Hiệu Để Đàm Phán Với Nhà Thầu', 'l2lDuECQHvY', 'Bất động sản'],
    ['Phân Tích Lô Đất', 'aEo6vyDa4bI', 'Bất động sản'],
    ['Cẩn Thận Khi Chọn Nhà Thầu', '3Qd0XQE4E5E', 'Bất động sản']
  ],

  shortForm: [
    ['COOLMATE - StoryTelling', 'Q2xcqij-RTs', 'Sự kiện'],
    ['SỰ KIỆN HYROX - Kevin Bùi', 'wNBnu3s9Idc', 'Sự kiện'],
    ['HYBRID HÀ NỘI', 'G27fN7u9BLY', 'Sự kiện'],
    ['Cuộc chiến của những người khoẻ nhất và bền nhất', '7581849884299463943', 'Sự kiện', 'tiktok', 'assets/img/tiktok-1.webp'],
    ['SỰ KIỆN CHẠY BỘ', 'YFMh3D4fcXg', 'Sự kiện'],
    ['Video chạy ADS', 'VjpeHQc0_Rg', 'Quảng cáo'],
    ['Kiến thức tài chính - 401k', '4MsK-kcAfUk', 'Giáo dục'],
    ['Bị gạ bán quần và chia sẻ công thức ngâm rượu tặng riêng cho kênh chat', 'Axw2EwOVZow', 'Gaming Shorts'],
    ['Chơi game PUBG mà toàn đi loot đồ kệ đồng đội', 'pqPmJJlCi7U', 'Gaming Shorts'],
    ['Ai bảo tao già nữa thì vô đây TAO XẺO HẾT !!!', 'OJfxOOFjogY', 'Gaming Shorts'],
    ['Khi đồng đội nằm xuống sẽ kích hoạt " Kim bài miễn tử " Hanakoishiiiii', 'oWzVSOm-iGg', 'Gaming Shorts'],
    ['Bài tập về nhà hôm nay lạ quá', 'P0QTO9w2cIw', 'Gaming Shorts'],
    ['Mở hòm PUBG săn nhân vật và skin vũ khí mới', 'ce-DFNxUqbY', 'Gaming Shorts'],
    ['Biết tí ngoại ngữ chơi game nó sang hẳn', 'aDxnCk16f3s', 'Gaming Shorts'],
    ['MetalD cái tôi quá lớn #pubg #taikonn', 'nWWvKRaT7Ro', 'Gaming Shorts'],
    ['Cứ để anh phải nóng #pubg #taikonn', 'hVUoJBcAGeo', 'Gaming Shorts'],
    ['Trò hơn Thầy là.... #Taikonn #PUBG', '7568773400424975632', 'Gaming Shorts', 'tiktok', 'assets/img/tiktok-2.webp'],
    ['Kong đã biết 1 bí mật của Kronus', 'I1GJIRqToi4', 'Gaming Shorts'],
    ['phản ứng của Kronus khi Kong thả thính lần 2', 'hrI70L2B4Ps', 'Gaming Shorts'],
    ['Kong làm gì Kronus thế này', '0x-m4JcwrgQ', 'Gaming Shorts'],
    ['yeee được gọi là chồng rồi =)))', 'zwyLJWbeFgY', 'Gaming Shorts'],
    ['Anh Kong ơi... em sợ quá à', 'AR210xY0kzo', 'Gaming Shorts']
  ],

  /*
   * CASE STUDY nổi bật trên trang chủ.
   * "result" để trống thì dòng Kết quả sẽ tự ẩn — điền số liệu thật khi có
   * (ví dụ: '1,2M lượt xem · retention 62%').
   */
  cases: [
    {
      id: '3Dj5D4r3oys', format: 'landscape', category: 'Bất động sản',
      title: 'Blanca City — Vũng Tàu',
      client: 'Dự án của Sungroup',
      brief: 'Giới thiệu dự án nghỉ dưỡng cao cấp sao cho người xem cảm được không gian trước khi đọc thông số.',
      role: 'Dựng, chỉnh màu sang trọng, nhạc nền và đồ hoạ chữ tinh gọn.',
      result: '',
      tags: ['Color grading', 'Motion text', 'Sound design']
    },
    {
      id: 'Q2xcqij-RTs', format: 'portrait', category: 'Sự kiện',
      title: 'Coolmate — Storytelling',
      client: 'Short-form 9:16',
      brief: 'Kể một câu chuyện thương hiệu trọn vẹn trong vài chục giây, giữ người xem không lướt qua.',
      role: 'Hook 3 giây đầu, nhịp cắt theo nhạc, caption động.',
      result: '',
      tags: ['Hook 3s', 'Beat cut', 'Caption động']
    },
    {
      id: 'Wza62cbrGxc', format: 'landscape', category: 'Sự kiện',
      title: 'HYROX Hà Nội',
      client: 'Recap sự kiện thể thao',
      brief: 'Biến hàng giờ footage thi đấu thành một bản recap có cao trào và cảm xúc.',
      role: 'Chọn khoảnh khắc, dựng nhịp tăng dần, phối SFX và âm thanh hiện trường.',
      result: '',
      tags: ['Event recap', 'SFX', 'Pacing']
    }
  ],

  /* DỊCH VỤ — "price" để trống sẽ hiển thị "Báo giá theo brief". Ví dụ: 'Từ 300.000₫' */
  services: [
    { code: 'A1', name: 'Shorts · Reels · TikTok', desc: 'Hook mạnh, caption động, nhịp nhanh bắt trend.', time: '1–2 ngày', price: '', color: '#d0688f' },
    { code: 'A2', name: 'Video YouTube dài', desc: 'Gaming, vlog, review — giữ nhịp để người xem ở lại tới cuối.', time: '3–5 ngày', price: '', color: '#9a82d6' },
    { code: 'A3', name: 'Podcast & khoá học', desc: 'Lọc âm, cân bằng giọng, chèn đồ hoạ minh hoạ dễ hiểu.', time: '2–4 ngày', price: '', color: '#d98a35' },
    { code: 'A4', name: 'Quảng cáo · sự kiện · BĐS', desc: 'Màu điện ảnh, CTA rõ ràng, đúng tinh thần thương hiệu.', time: '2–5 ngày', price: '', color: '#2fb592' }
  ],

  /* LỜI KHÁCH HÀNG — thêm vào đây thì mục Feedback mới hiện ra trên trang chủ.
     Ví dụ: { quote: 'Edit nhanh, hiểu ý...', name: 'Nguyễn Văn A', role: 'YouTuber 500K sub' } */
  testimonials: [],

  contact: {
    email: 'leductai294@gmail.com',
    phone: '0376347357',
    phoneLabel: '0376 347 357',
    zalo: 'https://zalo.me/0376347357',
    facebook: 'https://www.facebook.com/uctai.787518',
    instagram: 'https://www.instagram.com/ducktai2904/',
    tiktok: 'https://www.tiktok.com/@ducktaieditor294'
  }
};
