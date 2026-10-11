import XCTest
@testable import VerseReference
final class VerseReferenceTests: XCTestCase {
    func testSharedText() {
        XCTAssertEqual(VerseReference.extract("Read John 3:16 today"), ["John 3:16"])
        XCTAssertEqual(VerseReference.extract("1Corinthians 13:4–7"), ["1 Corinthians 13:4-7"])
        XCTAssertEqual(VerseReference.extract("Psalm 23:1 and Song of Songs 2:1"), ["Psalms 23:1", "Song of Solomon 2:1"])
        XCTAssertEqual(VerseReference.extract("JOHN 3 : 16; John 3:16"), ["John 3:16"])
    }
    func testMissingAndInvalidReferences() {
        for value in ["3:16", "notJohn 3:16", "John 22:1", "John 0:1", "John 3:0", "John 3:20-2", "John 3:1-20", "John 3:999"] { XCTAssertEqual(VerseReference.extract(value), [], value) }
    }
    func testSharedLinks() {
        let url = URL(string: "https://example.org/#:~:text=John%203%3A16")!
        XCTAssertEqual(VerseReference.extract(VerseReference.text(from: url)), ["John 3:16"])
        XCTAssertEqual(VerseReference.text(from: URL(string: "https://example.org/")!), "")
        let context = VerseReference.contextURL("John 3:16")!
        XCTAssertEqual(context.host, "this-verse-explained.wintechpartners.chatgpt.site")
        XCTAssertEqual(URLComponents(url: context, resolvingAgainstBaseURL: false)?.queryItems?.first?.value, "John 3:16")
        XCTAssertNil(VerseReference.contextURL("3:16"))
    }
}
