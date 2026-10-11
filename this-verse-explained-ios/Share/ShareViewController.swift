import UIKit
import UniformTypeIdentifiers

final class ShareViewController: UIViewController {
    private let field = UITextField()
    private let message = UILabel()
    private var values: [String] = []
    private var loaded = false
    private var navigation: UINavigationController?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.047, green: 0.098, blue: 0.161, alpha: 1)
        overrideUserInterfaceStyle = .dark
        let title = UILabel(); title.text = "This Verse Explained"; title.font = .boldSystemFont(ofSize: 26); title.textColor = .white
        message.text = "Reading the shared reference…"; message.textColor = .systemGray2; message.numberOfLines = 0
        field.placeholder = "Book chapter:verse, e.g. John 3:16"; field.borderStyle = .roundedRect
        field.autocorrectionType = .no; field.accessibilityLabel = "Bible verse reference"
        field.addTarget(self, action: #selector(editChanged), for: .editingChanged)
        let explain = UIButton(type: .system); explain.setTitle("Get the context", for: .normal)
        explain.backgroundColor = .systemOrange; explain.setTitleColor(.white, for: .normal); explain.layer.cornerRadius = 12
        explain.heightAnchor.constraint(equalToConstant: 52).isActive = true
        explain.addTarget(self, action: #selector(openContext), for: .touchUpInside)
        let cancel = UIButton(type: .system); cancel.setTitle("Done", for: .normal); cancel.addTarget(self, action: #selector(done), for: .touchUpInside)
        let stack = UIStackView(arrangedSubviews: [title, message, field, explain, cancel]); stack.axis = .vertical; stack.spacing = 20
        stack.translatesAutoresizingMaskIntoConstraints = false; view.addSubview(stack)
        NSLayoutConstraint.activate([stack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24), stack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24), stack.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 24)])
        collectSharedItems()
    }

    private func collectSharedItems() {
        let group = DispatchGroup()
        for item in (extensionContext?.inputItems as? [NSExtensionItem] ?? []) {
            if let text = item.attributedContentText?.string { values.append(text) }
            for provider in item.attachments ?? [] {
                let type: String?
                if provider.hasItemConformingToTypeIdentifier(UTType.propertyList.identifier) { type = UTType.propertyList.identifier }
                else if provider.hasItemConformingToTypeIdentifier(UTType.plainText.identifier) { type = UTType.plainText.identifier }
                else if provider.hasItemConformingToTypeIdentifier(UTType.url.identifier) { type = UTType.url.identifier }
                else { type = nil }
                guard let type else { continue }
                group.enter()
                provider.loadItem(forTypeIdentifier: type, options: nil) { [weak self] item, _ in
                    var text = ""
                    if let url = item as? URL { text = VerseReference.text(from: url) }
                    else if let string = item as? String {
                        text = string
                        if let url = URL(string: string), ["https", "http"].contains(url.scheme ?? "") { text = VerseReference.text(from: url) }
                    } else if let data = item as? Data { text = String(data: data, encoding: .utf8) ?? "" }
                    else if let dictionary = item as? [String: Any], let results = dictionary[NSExtensionJavaScriptPreprocessingResultsKey] as? [String: Any] { text = results["selectedText"] as? String ?? "" }
                    DispatchQueue.main.async { self?.values.append(text); group.leave() }
                }
            }
        }
        group.notify(queue: .main) { [weak self] in
            guard let self, !self.loaded else { return }; self.loaded = true
            // Don't overwrite a correction the reader has started entering.
            guard self.field.text?.isEmpty != false else { return }
            var references: [String] = []
            for text in self.values { for ref in VerseReference.extract(text) where !references.contains(ref) { references.append(ref) } }
            if references.count == 1 {
                self.field.text = references[0]; self.message.text = "Confirm the verse, then get its context."
            } else if references.count > 1 {
                self.message.text = "Several references were shared. Choose the one you want."
                let alert = UIAlertController(title: "Choose a verse", message: nil, preferredStyle: .alert)
                for reference in references.prefix(12) { alert.addAction(UIAlertAction(title: reference, style: .default) { _ in self.field.text = reference }) }
                alert.addAction(UIAlertAction(title: "Enter a reference", style: .cancel))
                self.present(alert, animated: true)
            } else { self.message.text = "The shared item did not include a complete reference. Enter the book, chapter, and verse. Chrome may share a page link instead of highlighted text." }
        }
    }
    @objc private func editChanged() { message.text = "Include the book name, chapter, and verse." }
    @objc private func openContext() {
        guard SubscriptionAccess.active() else {
            message.text = "Open This Verse Explained and subscribe or restore your purchase first. Bible for Life Stages subscriptions do not include this app. Then return to Chrome and share the verse again."
            return
        }
        let references = VerseReference.extract(field.text ?? "")
        guard references.count == 1, let url = VerseReference.contextURL(references[0]) else {
            message.text = "Enter one valid reference, such as John 3:16. Passages can contain up to 15 verses."; return
        }
        field.resignFirstResponder()
        let context = ContextWebViewController(url: url); context.title = references[0]
        context.navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Done", style: .done, target: self, action: #selector(done))
        let nav = UINavigationController(rootViewController: context); nav.overrideUserInterfaceStyle = .dark
        addChild(nav); nav.view.translatesAutoresizingMaskIntoConstraints = false; view.addSubview(nav.view)
        NSLayoutConstraint.activate([nav.view.topAnchor.constraint(equalTo: view.topAnchor), nav.view.bottomAnchor.constraint(equalTo: view.bottomAnchor), nav.view.leadingAnchor.constraint(equalTo: view.leadingAnchor), nav.view.trailingAnchor.constraint(equalTo: view.trailingAnchor)])
        nav.didMove(toParent: self); navigation = nav
    }
    @objc private func done() { extensionContext?.completeRequest(returningItems: nil, completionHandler: nil) }
}
