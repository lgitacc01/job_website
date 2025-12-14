import amqp from 'amqplib';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Recommend from '../models/Recommend.js'; 

dotenv.config();

const AMQP_URL = process.env.RABBITMQ_URI;

export const startWorker = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("✅ [Recommend Worker] Đã kết nối MongoDB");
        }

        if (!AMQP_URL) return console.error("❌ Thiếu RABBITMQ_URI");

        const connection = await amqp.connect(AMQP_URL);
        const channel = await connection.createChannel();

        const exchange = 'app_events';
        await channel.assertExchange(exchange, 'direct', { durable: true });
        const q = await channel.assertQueue('recommend_queue', { durable: true });
        await channel.bindQueue(q.queue, exchange, 'user_search');

        console.log("✅ [Recommend Worker] Đang chạy (Chế độ: Lưu 1 từ khóa mới nhất)...");

        channel.consume(q.queue, async (msg) => {
            if (msg !== null) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    const { userId, keyword } = content;

                    console.log(`📥 [Recommend] Cập nhật User ${userId}: "${keyword}"`);

                    // ========================================================
                    // 🔴 LOGIC MỚI: GHI ĐÈ TỪ KHÓA CŨ BẰNG TỪ KHÓA MỚI
                    // ========================================================
                    await Recommend.findOneAndUpdate(
                        { userId: userId }, 
                        { 
                            // Sử dụng $set để thay thế toàn bộ giá trị cũ
                            // Lưu ý: Vì Model bạn khai báo last_search là mảng [String]
                            // nên ta lưu là [keyword] (mảng chứa 1 phần tử)
                            $set: { last_search: keyword } 
                        },
                        { upsert: true, new: true } 
                    );
                    
                    console.log("✅ Đã ghi đè sở thích mới thành công.");

                    channel.ack(msg); 

                } catch (err) {
                    console.error("❌ Lỗi lưu DB Recommend:", err);
                    channel.ack(msg);
                }
            }
        });

    } catch (error) {
        console.error("❌ Lỗi Worker:", error);
    }
};