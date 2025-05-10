<?php
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=mutabaah_report.csv');

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Create output stream
$output = fopen('php://output', 'w');

// CSV headers
$headers = [
    'Tanggal', 
    'Sholat Wajib', 
    'Sholat Tahajud', 
    'Sholat Dhuha',
    'Sholat Rawatib',
    'Tilawah Quran',
    'Terjemah Quran',
    'Shaum Sunnah',
    'Shodaqoh',
    'Dzikir Pagi/Petang',
    'Istighfar (x1000)',
    'Sholawat (x100)',
    'Menyimak MQ Pagi',
    'Kajian Al-Hikam',
    'Kajian Ma\'rifatullah'
];

if ($data['user']['isFemale']) {
    $headers[] = 'Status Haid';
}

fputcsv($output, $headers);

// Add data rows
foreach ($data['reportData'] as $row) {
    $csvRow = [
        $row['date'],
        $row['sholat_wajib'],
        $row['sholat_tahajud'],
        $row['sholat_dhuha'],
        $row['sholat_rawatib'],
        $row['tilawah_quran'],
        $row['terjemah_quran'],
        $row['shaum_sunnah'],
        $row['shodaqoh'],
        $row['dzikir_pagi_petang'],
        $row['istighfar_1000x'],
        $row['sholawat_100x'],
        $row['menyimak_mq_pagi'],
        $row['kajian_al_hikam'],
        $row['kajian_marifatullah']
    ];

    if ($data['user']['isFemale']) {
        $csvRow[] = $row['haid'] ?? 0;
    }

    fputcsv($output, $csvRow);
}

fclose($output);
exit;
?>