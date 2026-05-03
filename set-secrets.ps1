# set-secrets.ps1
# Run from the Bridgeway V2 root directory.
# Fill in your real values before running!
#
# Usage: .\set-secrets.ps1

$secrets = @{
  SENDGRID_API_KEY    = "YOUR_SENDGRID_API_KEY_HERE"
  SENDGRID_FROM_EMAIL = "noreply@yourdomain.com"
  TWILIO_ACCOUNT_SID  = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  TWILIO_AUTH_TOKEN   = "your_twilio_auth_token"
  TWILIO_FROM_NUMBER  = "+1XXXXXXXXXX"
  SUPABASE_URL        = "https://your-project.supabase.co"
  SUPABASE_SERVICE_KEY = "your-supabase-service-role-key"
}

foreach ($name in $secrets.Keys) {
  $value = $secrets[$name]
  Write-Host "Setting secret: $name"
  $value | npx firebase-tools secrets:set $name --data-file=-
  Write-Host "Done: $name"
}

Write-Host "`nAll secrets set. Now run:"
Write-Host "  npx firebase-tools deploy --only functions,firestore:indexes"
