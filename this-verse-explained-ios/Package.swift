// swift-tools-version: 5.9
import PackageDescription
let package = Package(name: "VerseReference", products: [.library(name: "VerseReference", targets: ["VerseReference"])], targets: [
    .target(name: "VerseReference", path: "Shared", exclude: ["ContextWebViewController.swift"]),
    .testTarget(name: "VerseReferenceTests", dependencies: ["VerseReference"], path: "Tests")
])
