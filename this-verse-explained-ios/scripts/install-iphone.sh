#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${APPLE_TEAM_ID:?Set APPLE_TEAM_ID to your existing Apple Developer team ID}"
: "${IPHONE_UDID:?Set IPHONE_UDID to your connected iPhone identifier}"
command -v xcodegen >/dev/null || { echo 'Install XcodeGen with brew install xcodegen'; exit 1; }
swift test
xcodegen generate
# Xcode must already be signed in to the user's Apple Developer account.
xcodebuild -project ThisVerseExplained.xcodeproj -scheme ThisVerseExplained \
  -configuration Debug -sdk iphoneos -destination "id=$IPHONE_UDID" \
  -derivedDataPath build/device DEVELOPMENT_TEAM="$APPLE_TEAM_ID" \
  -allowProvisioningUpdates build
app=build/device/Build/Products/Debug-iphoneos/ThisVerseExplained.app
test -d "$app/PlugIns/VerseShare.appex"
xcrun devicectl device install app --device "$IPHONE_UDID" "$app"
xcrun devicectl device process launch --device "$IPHONE_UDID" com.wintechpartners.thisverseexplained
