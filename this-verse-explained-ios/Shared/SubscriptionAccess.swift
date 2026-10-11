import Foundation
import Security

enum SubscriptionAccess {
    static let monthly = "com.wintechpartners.thisverseexplained.monthly"
    static let yearly = "com.wintechpartners.thisverseexplained.yearly"
    static let products: Set<String> = [monthly, yearly]
    private static var query: [String: Any] {
        [kSecClass as String: kSecClassGenericPassword,
         kSecAttrService as String: "ThisVerseExplained.subscription",
         kSecAttrAccount as String: "apple-verified-entitlement",
         kSecAttrAccessGroup as String: "LLWKD27S4H.com.wintechpartners.thisverseexplained"]
    }
    struct Record: Codable {
        let productID: String
        let expiry: Date
        let signedTransaction: String
    }
    static func save(_ record: Record?) throws {
        SecItemDelete(query as CFDictionary)
        guard let record else { return }
        var item = query
        item[kSecValueData as String] = try JSONEncoder().encode(record)
        item[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        let status = SecItemAdd(item as CFDictionary, nil)
        guard status == errSecSuccess else { throw NSError(domain: NSOSStatusErrorDomain, code: Int(status)) }
    }
    // Only the signed companion app writes this item after StoreKit verification.
    // LifeStages products and membership never qualify for access.
    static func active() -> Bool {
        var item = query; item[kSecReturnData as String] = true; item[kSecMatchLimit as String] = kSecMatchLimitOne
        var result: CFTypeRef?
        guard SecItemCopyMatching(item as CFDictionary, &result) == errSecSuccess,
              let data = result as? Data, let record = try? JSONDecoder().decode(Record.self, from: data),
              products.contains(record.productID), record.expiry > Date(), record.signedTransaction.split(separator: ".").count == 3 else { return false }
        return true
    }
}
