import XCTest

final class ShareFlowTests: XCTestCase {
    func testHighlightedReferenceArrivesInExtension() {
        let app = XCUIApplication()
        app.launchArguments = ["--share-fixture"]
        app.launch()
        let extensionName = NSPredicate(format: "label CONTAINS[c] %@", "This Verse Explained")
        var share = app.buttons.matching(extensionName).firstMatch
        if !share.waitForExistence(timeout: 10) {
            let more = app.buttons.matching(NSPredicate(format: "label BEGINSWITH[c] %@", "More")).firstMatch
            if more.exists { more.tap() }
            share = app.buttons.matching(extensionName).firstMatch
            if !share.exists {
                let cell = app.cells.matching(extensionName).firstMatch
                XCTAssertTrue(cell.waitForExistence(timeout: 5), "Embedded extension must appear in Share options")
                cell.tap()
            } else { share.tap() }
        } else { share.tap() }
        let field = app.textFields["Bible verse reference"]
        XCTAssertTrue(field.waitForExistence(timeout: 10), "Share extension must open its reference confirmation UI")
        XCTAssertEqual(field.value as? String, "John 3:16")
        XCTAssertTrue(app.buttons["Get the context"].exists)
        let screenshot = XCTAttachment(screenshot: app.screenshot())
        screenshot.name = "Shared John 3-16 in This Verse Explained"
        screenshot.lifetime = .keepAlways
        add(screenshot)
        app.buttons["Done"].tap()
    }
}
