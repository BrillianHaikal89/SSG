export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { user, period, data } = req.body;

        // Validate data
        if (!data || !Array.isArray(data)) {
            throw new Error('Format data tidak valid');
        }

        // CSV Headers
        const headers = [
            'Tanggal',
            'Sholat Wajib',
            'Tahajud',
            'Dhuha',
            'Tilawah Quran',
            'Shaum Sunnah'
        ];

        if (user.isFemale) headers.push('Haid');

        // Generate CSV Content
        let csvContent = headers.join(',') + '\n';

        data.forEach(item => {
            const row = [
                new Date(item.date).toLocaleDateString('id-ID'),
                item.sholat_wajib,
                item.sholat_tahajud ? 'Ya' : 'Tidak',
                item.sholat_dhuha || '0',
                item.tilawah_quran ? 'Ya' : 'Tidak',
                item.shaum_sunnah ? 'Ya' : 'Tidak'
            ];

            if (user.isFemale) row.push(item.haid ? 'Ya' : 'Tidak');

            csvContent += row.join(',') + '\n';
        });

        // Set Response Headers
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="laporan-mutabaah.csv"');

        return res.status(200).send(csvContent);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Gagal generate laporan'
        });
    }
}