export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Forward request to PHP script
        const response = await fetch('http://localhost:3000/components/my/download_csv.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.blob();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=mutabaah_report.csv');
        data.stream().pipe(res);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}