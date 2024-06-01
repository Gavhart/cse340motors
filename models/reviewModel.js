const pool = require('../database/pool');

class Review {
    static async addReview({ userId, vehicleId, rating, comment }) {
        const sql = `INSERT INTO reviews (user_id, vehicle_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [userId, vehicleId, rating, comment];
        try {
            const result = await pool.query(sql, values);
            return result.rows[0];
        } catch (err) {
            console.error('Error adding review', err);
            throw err;
        }
    }
    
    static async getReviewsByVehicle(vehicleId) {
        const sql = `SELECT * FROM reviews WHERE vehicle_id = $1`;
        try {
            const result = await pool.query(sql, [vehicleId]);
            return result.rows;
        } catch (err) {
            console.error('Error retrieving reviews', err);
            throw err;
        }
    }
}
module.exports = Review;