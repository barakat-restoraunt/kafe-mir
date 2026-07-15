$imgDir = "$PSScriptRoot\images\menu"
$html = Get-Content "$PSScriptRoot\index.html" -Raw -Encoding UTF8
$urls = [regex]::Matches($html, 'src="(https://i\.ibb\.co/[^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

$i = 0
foreach ($url in $urls) {
    $i++
    $hash = ($url -split '/')[3]
    $outFile = "$imgDir\$hash.jpg"
    $outWebp = "$imgDir\$hash.webp"
    
    Write-Host "[$i/$($urls.Count)] $hash..."
    
    # Remove old low-quality webp
    if (Test-Path $outWebp) { Remove-Item $outWebp }
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing -TimeoutSec 30
        # Better quality: 1200px width, quality 3 (high quality webp)
        & ffmpeg -i $outFile -vf "scale='min(1200,iw)':'-1'" -quality 3 -y $outWebp 2>$null
        if (Test-Path $outWebp) { Remove-Item $outFile }
        $size = [math]::Round((Get-Item $outWebp).Length / 1KB)
        Write-Host "  OK ($size KB)"
    } catch {
        Write-Host "  FAILED"
    }
}

Write-Host ""
Write-Host "Done!"
