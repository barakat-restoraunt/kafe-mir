$ErrorActionPreference = "Stop"
$imgDir = "C:\Users\User\OneDrive\Рабочий стол\Кафе МИР\images\menu"
$htmlPath = "C:\Users\User\OneDrive\Рабочий стол\Кафе МИР\index.html"

$html = Get-Content $htmlPath -Raw -Encoding UTF8
$pattern = 'src="(https://i\.ibb\.co/[^"]+)"'
$urls = [regex]::Matches($html, $pattern) | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

Write-Host "Found $($urls.Count) images"

$i = 0
foreach ($url in $urls) {
    $i++
    $hash = ($url -split '/')[3]
    $jpgPath = Join-Path $imgDir "$hash.jpg"
    $webpPath = Join-Path $imgDir "$hash.webp"

    if (Test-Path $webpPath) { Remove-Item $webpPath }
    if (Test-Path $jpgPath) { Remove-Item $jpgPath }

    Write-Host "[$i/$($urls.Count)] $hash" -NoNewline

    try {
        $wc = New-Object System.Net.WebClient
        $wc.DownloadFile($url, $jpgPath)
        $origKB = [math]::Round((Get-Item $jpgPath).Length / 1024)

        $ffArgs = @("-i", $jpgPath, "-vf", "scale='min(1200,iw)':'-1'", "-c:v", "libwebp", "-qmin", "2", "-qmax", "30", "-q:v", "3", "-preset", "photo", "-an", "-y", $webpPath)
        $proc = Start-Process -FilePath "ffmpeg" -ArgumentList $ffArgs -WindowStyle Hidden -PassThru
        $proc.WaitForExit(30000)

        if (Test-Path $webpPath) {
            $newKB = [math]::Round((Get-Item $webpPath).Length / 1024)
            Write-Host " : ${origKB}KB -> ${newKB}KB"
            Remove-Item $jpgPath
        } else {
            Write-Host " : ffmpeg fail"
        }
    } catch {
        Write-Host " : error - $($_.Exception.Message)"
    }
}

Write-Host "`nDone!"
