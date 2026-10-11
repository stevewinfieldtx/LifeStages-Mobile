import UIKit
import StoreKit

@MainActor
final class SubscriptionViewController: UIViewController {
    private let message = UILabel()
    private let monthly = UIButton(type: .system)
    private let yearly = UIButton(type: .system)
    private var products: [Product] = []
    private var updates: Task<Void, Never>?
    private var content: ContextWebViewController?
    private var performing = false
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "This Verse Explained"
        view.backgroundColor = UIColor(red: 0.047, green: 0.098, blue: 0.161, alpha: 1)
        let heading = UILabel(); heading.text = "Understand any Bible verse."; heading.textColor = .white
        heading.font = .boldSystemFont(ofSize: 28); heading.numberOfLines = 0
        let detail = UILabel(); detail.text = "Get the historical context using a typed reference, the LifeStages verse picker, or Chrome’s Share menu. A separate This Verse Explained subscription is required, including for Bible for Life Stages customers."; detail.numberOfLines = 0; detail.textColor = .systemGray2
        message.numberOfLines = 0; message.textColor = .systemGray2
        monthly.setTitle("Monthly · $2.49 USD / month", for: .normal)
        yearly.setTitle("Annual · $24.99 USD / year", for: .normal)
        for button in [monthly, yearly] { button.backgroundColor = .systemOrange; button.setTitleColor(.white, for: .normal); button.layer.cornerRadius = 12; button.heightAnchor.constraint(equalToConstant: 54).isActive = true; button.isEnabled = false }
        monthly.addTarget(self, action: #selector(buyMonthly), for: .touchUpInside)
        yearly.addTarget(self, action: #selector(buyYearly), for: .touchUpInside)
        let restore = UIButton(type: .system); restore.setTitle("Restore purchases", for: .normal); restore.addTarget(self, action: #selector(restorePurchases), for: .touchUpInside)
        let legal = UILabel(); legal.numberOfLines = 0; legal.font = .systemFont(ofSize: 12); legal.textColor = .systemGray2
        legal.text = "Subscriptions renew automatically unless canceled at least 24 hours before the end of the current period. Manage or cancel in your Apple account settings. Apple displays local pricing before purchase."
        let privacy = UIButton(type: .system); privacy.setTitle("Privacy policy", for: .normal); privacy.addTarget(self, action: #selector(showPrivacy), for: .touchUpInside)
        let terms = UIButton(type: .system); terms.setTitle("Terms of use", for: .normal); terms.addTarget(self, action: #selector(showTerms), for: .touchUpInside)
        let stack = UIStackView(arrangedSubviews: [heading, detail, monthly, yearly, restore, message, legal, privacy, terms]); stack.axis = .vertical; stack.spacing = 16
        let scroll = UIScrollView(); scroll.translatesAutoresizingMaskIntoConstraints = false; view.addSubview(scroll)
        stack.translatesAutoresizingMaskIntoConstraints = false; scroll.addSubview(stack)
        NSLayoutConstraint.activate([scroll.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor), scroll.bottomAnchor.constraint(equalTo: view.bottomAnchor), scroll.leadingAnchor.constraint(equalTo: view.leadingAnchor), scroll.trailingAnchor.constraint(equalTo: view.trailingAnchor), stack.topAnchor.constraint(equalTo: scroll.contentLayoutGuide.topAnchor, constant: 24), stack.bottomAnchor.constraint(equalTo: scroll.contentLayoutGuide.bottomAnchor, constant: -24), stack.leadingAnchor.constraint(equalTo: scroll.contentLayoutGuide.leadingAnchor, constant: 24), stack.trailingAnchor.constraint(equalTo: scroll.contentLayoutGuide.trailingAnchor, constant: -24), stack.widthAnchor.constraint(equalTo: scroll.frameLayoutGuide.widthAnchor, constant: -48)])
        updates = Task { [weak self] in
            for await result in Transaction.updates {
                guard let self else { return }
                if case .verified(let transaction) = result, SubscriptionAccess.products.contains(transaction.productID) { await transaction.finish(); await self.refreshAccess() }
            }
        }
        Task { await refreshAccess(); await loadProducts() }
    }
    override func viewWillAppear(_ animated: Bool) { super.viewWillAppear(animated); Task { await refreshAccess() } }
    deinit { updates?.cancel() }
    private func refreshAccess() async {
        var record: SubscriptionAccess.Record?
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result,
                  SubscriptionAccess.products.contains(transaction.productID), transaction.revocationDate == nil,
                  !transaction.isUpgraded, let expiry = transaction.expirationDate, expiry > Date() else { continue }
            if record == nil || expiry > record!.expiry { record = .init(productID: transaction.productID, expiry: expiry, signedTransaction: result.jwsRepresentation) }
        }
        do { try SubscriptionAccess.save(record) } catch { message.text = "Apple verified your subscription, but sharing access could not be saved. Please reopen the app and try Restore purchases." }
        if record != nil { showContext() }
        else if let content {
            content.willMove(toParent: nil); content.view.removeFromSuperview(); content.removeFromParent(); self.content = nil
            navigationItem.rightBarButtonItem = nil
        }
    }
    private func showContext() {
        guard content == nil else { return }
        let controller = ContextWebViewController(url: URL(string: VerseReference.origin)!)
        addChild(controller); controller.view.translatesAutoresizingMaskIntoConstraints = false; view.addSubview(controller.view)
        NSLayoutConstraint.activate([controller.view.topAnchor.constraint(equalTo: view.topAnchor), controller.view.bottomAnchor.constraint(equalTo: view.bottomAnchor), controller.view.leadingAnchor.constraint(equalTo: view.leadingAnchor), controller.view.trailingAnchor.constraint(equalTo: view.trailingAnchor)])
        controller.didMove(toParent: self); content = controller
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Subscription", style: .plain, target: self, action: #selector(manage))
    }
    private func loadProducts() async {
        do {
            products = try await Product.products(for: Array(SubscriptionAccess.products)).filter { $0.type == .autoRenewable }
            if let p = products.first(where: { $0.id == SubscriptionAccess.monthly }) { monthly.setTitle("\(p.displayPrice) / month", for: .normal); monthly.isEnabled = true }
            if let p = products.first(where: { $0.id == SubscriptionAccess.yearly }) { yearly.setTitle("\(p.displayPrice) / year", for: .normal); yearly.isEnabled = true }
            message.text = products.count == 2 ? "Choose monthly or annual access." : "Apple subscriptions are not available yet. Tap Restore purchases to restore an existing subscription."
        } catch { message.text = "Apple could not load subscriptions. Please check your connection and reopen the app." }
    }
    @objc private func buyMonthly() { buy(SubscriptionAccess.monthly) }
    @objc private func buyYearly() { buy(SubscriptionAccess.yearly) }
    private func buy(_ id: String) {
        guard !performing, let product = products.first(where: { $0.id == id }) else { return }
        performing = true
        Task {
            defer { performing = false }
            do {
                switch try await product.purchase() {
                case .success(let result):
                    guard case .verified(let transaction) = result, SubscriptionAccess.products.contains(transaction.productID) else { message.text = "Apple could not verify the purchase."; return }
                    await transaction.finish(); await refreshAccess()
                case .userCancelled: message.text = "Purchase canceled."
                case .pending: message.text = "Your purchase is awaiting Apple approval."
                @unknown default: message.text = "Apple could not complete this purchase."
                }
            } catch { message.text = "Apple could not complete this purchase. Please try again." }
        }
    }
    @objc private func restorePurchases() { Task { do { try await AppStore.sync(); await refreshAccess(); if content == nil { message.text = "No active This Verse Explained subscription was found. Bible for Life Stages subscriptions do not include this app." } } catch { message.text = "Apple could not restore purchases. Please try again." } } }
    @objc private func manage() { Task { if let scene = view.window?.windowScene { try? await AppStore.showManageSubscriptions(in: scene) } } }
    @objc private func showPrivacy() {
        let policy = UIViewController(); policy.title = "Privacy"; policy.view.backgroundColor = view.backgroundColor
        let text = UITextView(); text.isEditable = false; text.backgroundColor = .clear; text.textColor = .white; text.font = .systemFont(ofSize: 17); text.translatesAutoresizingMaskIntoConstraints = false
        text.text = "This Verse Explained sends the Bible reference you choose to our context service. It uses the reference to retrieve or generate a shared explanation and summary image. Generated context is cached and reused for other readers. The Share extension extracts references from the text or reference-bearing link you explicitly share; it does not fetch the original webpage.\n\nApple handles subscription payments. The app checks Apple-verified subscription transactions. A verified subscription record is stored in this app’s private shared keychain so its Share extension can check access. Bible for Life Stages purchases do not unlock this app. No payment-card details are stored by this app.\n\nThe currently hosted context service may require its own sign-in. Its account and access requirements remain separate from an Apple subscription."
        policy.view.addSubview(text)
        NSLayoutConstraint.activate([text.topAnchor.constraint(equalTo: policy.view.safeAreaLayoutGuide.topAnchor, constant: 16), text.bottomAnchor.constraint(equalTo: policy.view.safeAreaLayoutGuide.bottomAnchor, constant: -16), text.leadingAnchor.constraint(equalTo: policy.view.leadingAnchor, constant: 20), text.trailingAnchor.constraint(equalTo: policy.view.trailingAnchor, constant: -20)])
        navigationController?.pushViewController(policy, animated: true)
    }
    @objc private func showTerms() { navigationController?.pushViewController(ContextWebViewController(url: URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!), animated: true) }
}
