// filepath: /d:/apps/temp/Booking-System/backend/seedCourts.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING
});

async function seedCourts() {
    try {
        const courtsFile = path.join(__dirname, 'data', 'court.json');
        const data = fs.readFileSync(courtsFile, 'utf8');
        const courts = JSON.parse(data);

        for (const court of courts) {
            const { name, imgURLs, price, type, maxPlayers, currentBookings, location, description } = court;
            const query = `
                INSERT INTO courts (name, imgurls, price, type, maxplayers, currentbookings, location, description)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            await pool.query(query, [
                name,
                JSON.stringify(imgURLs), // storing as JSONB string
                price,
                type,
                maxPlayers,
                JSON.stringify(currentBookings),
                location,
                description
            ]);
        }

        console.log('Data seeded successfully');
    } catch (error) {
        console.error('Error seeding data', error);
    } finally {
        pool.end();
    }
}

seedCourts();

async function fetchCourts() {
    try {
        const result = await pool.query('SELECT * FROM courts');
        console.log(result.rows);
    } catch (error) {
        console.error('Error fetching data', error);
    }
}

fetchCourts();