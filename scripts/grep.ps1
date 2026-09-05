param(
  [Parameter(Mandatory=$true, Position=0)]
  [string]$Pattern,
  [Parameter(Mandatory=$false, Position=1)]
  [string]$Path = '.'
)

# Recursively search files under the given path and print matches in grep-like format: file:line:match
try {
  $searchPath = Join-Path -Path $Path -ChildPath "*"
  $results = Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
    Select-String -Path $_.FullName -Pattern $Pattern -SimpleMatch -ErrorAction SilentlyContinue
  }
  foreach ($r in $results) {
    "$($r.Path):$($r.LineNumber):$($r.Line)"
  }
} catch {
  Write-Error "Search failed: $_"
  exit 2
}