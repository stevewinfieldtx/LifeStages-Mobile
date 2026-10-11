import Foundation

enum VerseReference {
    static let books = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"]
    static let chapters = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22]
    static let origin = "https://this-verse-explained.wintechpartners.chatgpt.site/"

    static func extract(_ input: String) -> [String] {
        let normalized = input.replacingOccurrences(of: "\u{00a0}", with: " ")
            .replacingOccurrences(of: "–", with: "-").replacingOccurrences(of: "—", with: "-")
        let aliases = books + ["Psalm", "Song of Songs"]
        let names = aliases.sorted { $0.count > $1.count }.map { NSRegularExpression.escapedPattern(for: $0).replacingOccurrences(of: " ", with: "\\s*") }.joined(separator: "|")
        let pattern = "(?<![A-Za-z0-9])(" + names + ")\\s+(\\d{1,3})\\s*:\\s*(\\d{1,3})(?:\\s*-\\s*(\\d{1,3}))?(?![0-9])"
        guard let regex = try? NSRegularExpression(pattern: pattern, options: .caseInsensitive) else { return [] }
        let ns = normalized as NSString
        var output: [String] = []
        for match in regex.matches(in: normalized, range: NSRange(location: 0, length: ns.length)) {
            let name = ns.substring(with: match.range(at: 1)).replacingOccurrences(of: "\\s+", with: " ", options: .regularExpression)
            let compact = name.replacingOccurrences(of: " ", with: "").lowercased()
            let canonical = compact == "psalm" ? "Psalms" : compact == "songofsongs" ? "Song of Solomon" : books.first { $0.replacingOccurrences(of: " ", with: "").lowercased() == compact }
            guard let book = canonical, let index = books.firstIndex(of: book),
                  let chapter = Int(ns.substring(with: match.range(at: 2))), chapter > 0, chapter <= chapters[index],
                  let verse = Int(ns.substring(with: match.range(at: 3))), verse > 0, verse <= 176 else { continue }
            var reference = "\(book) \(chapter):\(verse)"
            if match.range(at: 4).location != NSNotFound {
                guard let end = Int(ns.substring(with: match.range(at: 4))), end >= verse, end <= 176, end - verse < 15 else { continue }
                reference += "-\(end)"
            }
            if !output.contains(reference) { output.append(reference) }
        }
        return output
    }

    // Only inspect data explicitly shared by the user. Never fetch the source webpage.
    static func text(from url: URL) -> String {
        guard let c = URLComponents(url: url, resolvingAgainstBaseURL: false) else { return "" }
        let query = c.queryItems?.filter { ["verse", "text", "reference"].contains($0.name) }.compactMap(\.value).joined(separator: " ") ?? ""
        let fragment = c.fragment ?? ""
        if let range = fragment.range(of: "text=") {
            return query + " " + String(fragment[range.upperBound...]).replacingOccurrences(of: ",", with: " ")
        }
        return query
    }

    static func contextURL(_ reference: String) -> URL? {
        guard extract(reference) == [reference], var c = URLComponents(string: origin) else { return nil }
        c.queryItems = [URLQueryItem(name: "verse", value: reference)]
        return c.url
    }
}
