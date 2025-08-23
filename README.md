# Hướng dẫn triển khai
## 1. Yêu cầu môi trường
- Node.js >= 16  
- npm hoặc yarn
## 2. Triển khai ứng dụng
```
git clone https://github.com/hoang1805/multigame.git
cd multigame
```
### 2.1. Cài đặt môi trường
Tạo file .env theo mẫu và điền các thông tin đã được định nghĩa ở .env.example
```env.example
ACCESS_TOKEN_SECRET = <your_access_secret>
ACCESS_TOKEN_EXPIRE = 30m

REFRESH_TOKEN_SECRET = <your_refresh_secret>
REFRESH_TOKEN_EXPIRE = 30d

WEBSOCKET_GATEWAY = 80
```
### 2.2. Triển khai ứng dụng
```
npm install
npm start
```
## 3. Kết quả test
<img width="614" height="320" alt="image" src="https://github.com/user-attachments/assets/c8ba57d0-c739-42db-9898-cc3013a1a850" />
