import XCTest
import SwiftTreeSitter
import TreeSitterWebvtt

final class TreeSitterWebvttTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_webvtt())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading WebVTT grammar")
    }
}
