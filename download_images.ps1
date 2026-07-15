$imgDir = "$PSScriptRoot\images\menu"
if (!(Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir -Force | Out-Null }

$html = Get-Content "$PSScriptRoot\index.html" -Raw -Encoding UTF8
$urls = [regex]::Matches($html, 'src="(https://i\.ibb\.co/[^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

$i = 0
foreach ($url in $urls) {
    $i++
    $hash = ($url -split '/')[3]
    $ext = [System.IO.Path]::GetExtension($url)
    if (!$ext) { $ext = ".jpg" }
    $outFile = "$imgDir\$hash$ext"
    $outWebp = "$imgDir\$hash.webp"
    
    if (Test-Path $outWebp) {
        Write-Host "[$i/$($urls.Count)] SKIP $hash"
        continue
    }
    
    Write-Host "[$i/$($urls.Count)] Downloading $hash..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing -TimeoutSec 30
        & ffmpeg -i $outFile -vf "scale='min(800,iw)':'-1'" -q:v 8 -y $outWebp 2>$null
        if (Test-Path $outWebp) { Remove-Item $outFile }
        Write-Host "  OK -> $hash.webp"
    } catch {
        Write-Host "  FAILED: $_"
    }
}

Write-Host ""
Write-Host "Done! Converting URLs in index.html..."

foreach ($url in $urls) {
    $hash = ($url -split '/')[3]
    $webpUrl = "images/menu/$hash.webp"
    $html = $html.Replace($url, $webpUrl)
}

Set-Content "$PSScriptRoot\index.html" -Value $html -Encoding UTF8 -NoNewline
Write-Host "All done! Open index.html"
