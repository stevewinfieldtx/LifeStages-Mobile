# This Verse Explained — iPhone Share extension

Separate native companion app and system Share extension. Both display the existing hosted context UI; no second context engine or provider ingestion is added.

## Flow

Highlight a complete Bible reference in Chrome on iPhone, tap Share, choose **This Verse Explained**, confirm the reference, then tap **Get the context**. The existing WEB passage, cached context, and summary image appear inside the Share extension. Done returns to Chrome. The app itself opens the existing typed-reference and LifeStages selector interface.

An installed native build is required. A home-screen web app cannot register this extension. Chrome can send different payloads depending on its version and where Share was opened. Plain text, attributed selection text, and reference-bearing links are accepted. Safari selection preprocessing is included separately; it does not imply Chrome executes it. If only an ordinary URL or chapter:verse without a book arrives, the reader must enter a complete reference. No source URL is fetched or scraped. Multiple references require choosing one.

The extension uses public extension-safe APIs and displays context within the extension. It does not attempt to force-launch the containing app. Authentication sessions in Chrome, the companion app, and the extension may be separate. The currently private site may require sign-in inside each WebView; test this before distribution. Do not embed any site bypass token or API key.

## Mac build / installation

1. Install Xcode and XcodeGen (`brew install xcodegen`).
2. Run `swift test`, then `xcodegen generate`.
3. Open `ThisVerseExplained.xcodeproj` and choose your Apple signing team for **both** targets. The bundle identifiers in project.yml are proposed local identifiers, not registered Apple IDs.
4. Select a connected iPhone and run the ThisVerseExplained scheme. An unsigned simulator archive cannot install on a real iPhone.
5. In Chrome Share > More, enable This Verse Explained and add it to Favorites.

GitHub Actions compiles both simulator targets and runs reference-parser tests. This does not sign a device build, create an App Store record, upload to TestFlight, or verify Chrome on a physical iPhone.

For a connected iPhone and a Mac already signed in to the Apple account, run `APPLE_TEAM_ID=<your-team> IPHONE_UDID=<your-phone> bash scripts/install-iphone.sh`. This builds, signs, installs, and launches the native app using Xcode automatic provisioning. No keys are embedded in the app or supplied to the website. Apple may require Developer Mode on the phone. For distribution to other readers, create this app's separate App Store Connect record and signed TestFlight build.

The simulator UI test opens Apple's actual system Share sheet with a fixture reference and checks that the extension receives it. This verifies system registration and text transfer, separately from Chrome-specific device testing and the authenticated hosted context page.

## Device acceptance checks

- Share John 3:16, 1 Corinthians 13:4–7, Psalm 23:1, and Song of Solomon 2:1 as selected text.
- Confirm actual Chrome payload handling, including a shared webpage link with/without a text fragment.
- Share two references and verify the chooser; share 3:16 alone and supply the book.
- Verify sign-in, cached context, finished summary image, collapsed sections, Done, offline error, and Reload.
- Confirm Share extension visibility on a signed physical-iPhone build and a TestFlight build before calling the feature released.
