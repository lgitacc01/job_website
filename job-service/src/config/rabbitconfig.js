import amqp from 'amqplib';
import dotenv from "dotenv";

dotenv.config(); 

const AMQP_URL = process.env.RABBITMQ_URI;

// -------------------------------------------------------------
// 1. Hàm Producer: Dùng để gửi tin nhắn (Controller sẽ gọi hàm này)
// -------------------------------------------------------------
export const publishSearchEvent = async (userId, keyword) => {
    try {
        if (!AMQP_URL) {
            throw new Error('Chưa cấu hình RABBITMQ_URI trong file .env');
        }

        // Tạo kết nối
        const connection = await amqp.connect(AMQP_URL);
        const channel = await connection.createChannel();
        
        const exchange = 'app_events';
        // Khởi tạo exchange
        await channel.assertExchange(exchange, 'direct', { durable: true });
        
        // Gửi tin nhắn
        const msg = JSON.stringify({ userId, keyword, timestamp: new Date() });
        channel.publish(exchange, 'user_search', Buffer.from(msg));
        
        console.log(`[Job] 🚀 Gửi event thành công: ${keyword}`);
        
        // Đóng kết nối (trong thực tế nên giữ kết nối, nhưng để test thì ok)
        setTimeout(() => connection.close(), 500);

    } catch (error) {
        console.error("❌ Lỗi Job Publisher:", error);
    }
};

// -------------------------------------------------------------
// 2. Hàm Default: Để index.js gọi lúc khởi động server (FIX LỖI CỦA BẠN)
// -------------------------------------------------------------
const connectRabbitMQ = async () => {
    try {
        console.log("Testing RabbitMQ Connection...");
        const connection = await amqp.connect(AMQP_URL);
        console.log("✅ [Job Service] RabbitMQ Connected successfully!");
        // Test xong đóng luôn cho đỡ tốn resource
        connection.close();
    } catch (error) {
        console.error("❌ [Job Service] RabbitMQ Connection Failed:", error.message);
    }
};

export default connectRabbitMQ;