## Tên đề tài: Xây dựng Website Bán Hàng Laptop

Trong thời đại công nghệ số hiện nay, thương mại điện tử đã và đang trở thành một xu hướng phát triển mạnh mẽ trên toàn cầu, bao gồm cả Việt Nam. Thị trường thương mại điện tử Việt Nam vẫn đang tăng trưởng với tốc độ ấn tượng sau thời kỳ COVID-19. Theo Hiệp hội Thương mại điện tử Việt Nam, ước tính trong năm 2023, thị trường đạt quy mô 25 tỷ USD, ghi nhận mức tăng trưởng ấn tượng hơn 25% so với năm 2022. Trong đó, bán lẻ hàng hóa trực tuyến đóng góp 17,3 tỷ USD, cho thấy tiềm năng to lớn của lĩnh vực này. Không những thế, thương mại điện tử còn chiếm 15-17% trong tổng giá trị kinh tế quốc gia.

Thị trường phụ kiện máy tính cũng không nằm ngoài xu hướng chung, nhu cầu mua linh kiện máy tính trực tuyến đang ngày càng gia tăng. Người tiêu dùng ưu tiên sự tiện lợi, có thể so sánh giá cả và đánh giá sản phẩm trước khi quyết định mua hàng. Việc mua sắm online không chỉ giúp tiết kiệm thời gian mà còn mang lại nhiều lựa chọn hơn, góp phần thúc đẩy thị trường mua bán phụ kiện máy tính trực tuyến phát triển mạnh mẽ.

## Mô tả và Mục tiêu Dự Án

### Mô Tả

Website FCOMPUTER là một trang web thương mại điện tử bán các sản phẩm laptop và phụ kiện. Website này sẽ có hai nhóm người dùng chính: **Quản lý (Admin)** và **Khách hàng (User)**.

- **Quản lý (Admin)**: Quản trị hệ thống, quản lý sản phẩm, quản lý khách hàng, thống kê doanh thu, và các chức năng quản trị khác giúp cho việc quản lý website một cách dễ dàng.
- **Khách hàng (User)**: Xem thông tin sản phẩm, tìm kiếm, thêm sản phẩm vào giỏ hàng và thực hiện thanh toán trực tuyến.

Website còn hỗ trợ các chức năng tìm kiếm, thống kê và quản lý giỏ hàng. Khách hàng có thể thêm sản phẩm vào giỏ và thanh toán trực tuyến. Phương thức thanh toán sẽ được hỗ trợ qua các phương thức đăng ký tài khoản và thanh toán trực tuyến.

### Mục Tiêu

- Xây dựng một ecommerce website bán và quản lý sản phẩm laptop, cho phép người dùng dễ dàng tìm kiếm, xem thông tin và mua các sản phẩm laptop và phụ kiện.
- Nghiên cứu và ứng dụng công nghệ MERN stack (MongoDB, Express, React, Node.js) để phát triển toàn bộ back-end và front-end của website.
- Tích hợp các tính năng như giỏ hàng, thanh toán trực tuyến, quản lý sản phẩm và quản lý đơn hàng vào website.
- Đảm bảo tính bảo mật, hiệu suất và trải nghiệm người dùng tốt cho website.

## Kiến thức áp dụng

- Phân tích thiết kế hệ thống
- Sử dụng MERN Stack (MongoDB, Express.js, React.js, Node.js)
- Áp dụng MUI (Material UI) thư viện React Component
- Tích hợp OAuth 2.0
- Sử dụng TanStack (React Query)
- Kiểm thử API với Postman

## Triển khai

### Nền tảng xây dựng

Dự án "Website bán laptop FCOMPUTER" được xây dựng trên nền tảng MERN stack, bao gồm MongoDB, Express.js, React.js và Node.js, cùng với các công nghệ bổ trợ như MUI, OAuth 2.0 và TanStack.

MERN Stack

- MongoDB: Là cơ sở dữ liệu NoSQL, MongoDB lưu trữ thông tin về sản phẩm, khách hàng và đơn hàng dưới dạng tài liệu JSON, giúp dễ dàng mở rộng và thao tác với dữ liệu không có cấu trúc cố định.

- Express.js: Đây là framework backend cho Node.js, giúp xử lý các yêu cầu HTTP từ phía client, tổ chức API và giao tiếp với cơ sở dữ liệu. Express.js giúp tối ưu hóa việc quản lý routing và middleware cho hệ thống.

- React.js: Là thư viện JavaScript phổ biến để xây dựng giao diện người dùng động. React.js sử dụng các component tái sử dụng, giúp tăng cường khả năng bảo trì và mở rộng giao diện người dùng một cách dễ dàng và hiệu quả. Đồng thời, React đảm bảo rằng các thay đổi trong giao diện sẽ được phản ánh ngay lập tức mà không cần phải tải lại toàn bộ trang.

- Node.js: Là môi trường chạy JavaScript phía server, giúp xử lý các yêu cầu HTTP, giao tiếp với cơ sở dữ liệu và điều phối logic phía server. Node.js cho phép xây dựng ứng dụng có khả năng xử lý đồng thời tốt, giúp hệ thống hoạt động nhanh và hiệu quả.

MUI (Material-UI)

- MUI là một thư viện UI phổ biến, được sử dụng để xây dựng giao diện người dùng hiện đại và thân thiện. MUI cung cấp một bộ sưu tập các component UI như nút bấm, thanh điều hướng, bảng dữ liệu, form nhập liệu... Các component này được thiết kế theo nguyên lý Material Design của Google, giúp giao diện trông đẹp mắt, đồng nhất và dễ sử dụng. Ngoài ra, MUI hỗ trợ tính năng responsive, giúp giao diện hoạt động tốt trên mọi loại thiết bị, từ desktop đến mobile.

OAuth 2.0

- Để bảo mật hệ thống và quản lý quyền truy cập của người dùng, chúng tôi sử dụng OAuth 2.0.

TanStack (React Query)

- TanStack (React Query) là một thư viện mạnh mẽ giúp quản lý việc truy vấn dữ liệu giữa frontend và backend. Nó hỗ trợ caching, đồng bộ hóa và tái sử dụng dữ liệu một cách hiệu quả, giúp cải thiện hiệu suất ứng dụng, giảm số lần gọi API và giảm độ trễ khi tải dữ liệu.

Postman

- Postman là công cụ được sử dụng để kiểm thử API, giúp kiểm tra và xác minh các endpoint của server trước khi triển khai. Với Postman, chúng tôi có thể dễ dàng gửi yêu cầu đến backend, kiểm tra các phản hồi từ API, từ đó đảm bảo rằng tất cả các tính năng và chức năng hoạt động chính xác.
