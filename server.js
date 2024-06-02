const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca body dari request POST
app.use(express.json());

// Endpoint untuk menampilkan semua pesan
app.get('/messages', (req, res) => {
    // Baca file JSON penyimpanan pesan
    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal membaca data pesan.' });
            return;
        }
        // Parse data JSON
        const messages = JSON.parse(data);
        res.json(messages);
    });
});

// Endpoint untuk menambahkan pesan baru
app.post('/messages', (req, res) => {
    const { name, message } = req.body;

    // Baca file JSON penyimpanan pesan
    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal membaca data pesan.' });
            return;
        }
        // Parse data JSON
        const messages = JSON.parse(data);

        // Tambahkan pesan baru ke dalam array pesan
        messages.push({ name, message });

        // Tulis kembali data pesan ke file JSON
        fs.writeFile('messages.json', JSON.stringify(messages), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Gagal menyimpan pesan baru.' });
                return;
            }
            res.status(201).json({ message: 'Pesan berhasil ditambahkan.' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
