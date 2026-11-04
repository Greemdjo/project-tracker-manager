
$ProjectPath = $PSScriptRoot
$OutputZip = Join-Path $ProjectPath "frontend.zip"

$ExcludeDirs = @(
    "node_modules",
    ".git",
    "dist",
    ".vite",
    "coverage",
    ".idea",
    ".vscode"
)

$ExcludeFiles = @(
    ".env",
    ".env.local",
    ".env.development.local",
    ".env.production.local",
    "frontend.zip"
)

$TempPath = Join-Path $env:TEMP "frontend_pack"

if (Test-Path $TempPath) {
    Remove-Item $TempPath -Recurse -Force
}

New-Item -ItemType Directory -Path $TempPath | Out-Null

$Files = Get-ChildItem -Path $ProjectPath -Recurse -File |
    Where-Object {
        $RelativePath = $_.FullName.Substring($ProjectPath.Length + 1)
        $Parts = $RelativePath -split '[\\/]'

        $ExcludedDirectory = $false

        foreach ($Dir in $ExcludeDirs) {
            if ($Parts -contains $Dir) {
                $ExcludedDirectory = $true
                break
            }
        }

        $ExcludedFile = $ExcludeFiles -contains $_.Name

        -not $ExcludedDirectory -and -not $ExcludedFile
    }

foreach ($File in $Files) {
    $RelativePath = $File.FullName.Substring($ProjectPath.Length + 1)
    $Destination = Join-Path $TempPath $RelativePath
    $DestinationDir = Split-Path $Destination -Parent

    New-Item -ItemType Directory -Path $DestinationDir -Force | Out-Null

    Copy-Item $File.FullName $Destination
}

if (Test-Path $OutputZip) {
    Remove-Item $OutputZip -Force
}

Compress-Archive `
    -Path "$TempPath\*" `
    -DestinationPath $OutputZip `
    -CompressionLevel Optimal

Remove-Item $TempPath -Recurse -Force

Write-Host "Архив создан: $OutputZip" -ForegroundColor Green
Write-Host "Файлов добавлено: $($Files.Count)" -ForegroundColor Cyan
