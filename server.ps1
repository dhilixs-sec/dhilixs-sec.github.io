# Simple, Lightweight PowerShell Static HTTP Web Server
param(
  [int]$Port = 5500
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
  Write-Host "==========================================================" -ForegroundColor DarkYellow
  Write-Host " ☕ Dhilipkumar N B - Portfolio Local Server Running!" -ForegroundColor Green
  Write-Host " Local URL: $prefix" -ForegroundColor Cyan
  Write-Host " Press Ctrl+C in this terminal to stop the server." -ForegroundColor Gray
  Write-Host "==========================================================" -ForegroundColor DarkYellow
} catch {
  Write-Error "Failed to start listener on port $Port : $_"
  exit 1
}

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif"  = "image/gif"
  ".ico"  = "image/x-icon"
  ".json" = "application/json"
  ".pdf"  = "application/pdf"
}

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
    if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
      $urlPath = "/index.html"
    }

    # Normalize relative path to prevent directory traversal
    $cleanPath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
    $filePath = [System.IO.Path]::Combine($root, $cleanPath)

    if ([System.IO.File]::Exists($filePath)) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $mime = "application/octet-stream"
      if ($mimeTypes.ContainsKey($ext)) {
        $mime = $mimeTypes[$ext]
      }

      $response.ContentType = $mime
      $response.StatusCode = 200
      $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")

      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      Write-Host "[200 OK] $urlPath ($mime)" -ForegroundColor Green
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
      $response.ContentType = "text/plain; charset=utf-8"
      $response.ContentLength64 = $msg.Length
      $response.OutputStream.Write($msg, 0, $msg.Length)
      Write-Host "[404 Not Found] $urlPath" -ForegroundColor Red
    }

    $response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
