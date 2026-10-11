import UIKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let window = UIWindow(frame: UIScreen.main.bounds)
        let controller = SubscriptionViewController()
        controller.title = "This Verse Explained"
        let nav = UINavigationController(rootViewController: controller)
        nav.overrideUserInterfaceStyle = .dark
        window.rootViewController = nav; window.makeKeyAndVisible(); self.window = window
        #if DEBUG
        if ProcessInfo.processInfo.arguments.contains("--share-fixture") {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                let sheet = UIActivityViewController(activityItems: ["John 3:16"], applicationActivities: nil)
                sheet.popoverPresentationController?.sourceView = nav.view
                nav.present(sheet, animated: false)
            }
        }
        #endif
        return true
    }
}
