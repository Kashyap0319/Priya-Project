<#
Usage: .\push-all.ps1 [-Message "commit message"]
This script stages all changes, commits with the provided message (or a default), and pushes to origin/main.
It does not bypass git authentication; you'll be prompted to authenticate if required.
#>

param(
    [string]$Message = "chore: add project files"
)

Write-Host "Running git add ."
git add .

Write-Host "Creating commit: $Message"
try {
    git commit -m "$Message"
} catch {
    Write-Host "No changes to commit or commit failed: $_"
}

Write-Host "Pushing to origin main"
git push origin main

Write-Host "Done. If git requested credentials, please authenticate as prompted."
