import Foundation

// 앱(lib/widgetPayload.ts)이 App Group에 저장하는 데이터
struct WidgetWord: Codable, Hashable {
  let id: String
  let text: String
  let part: String
  let meaning: String
  let example: String
  let wordbookId: String
  let wrong: Bool
}

struct WidgetWordbook: Codable, Hashable {
  let id: String
  let name: String
}

struct WidgetData: Codable {
  let wordbooks: [WidgetWordbook]
  let words: [WidgetWord]

  // modules/rovoca-widget/ios/RovocaWidgetModule.swift와 같아야 한다
  static let appGroup = "group.com.yoy0zmaps.rovoc"
  static let dataKey = "widgetData"

  static func load() -> WidgetData? {
    guard
      let json = UserDefaults(suiteName: appGroup)?.string(forKey: dataKey),
      let data = json.data(using: .utf8)
    else {
      return nil
    }
    return try? JSONDecoder().decode(WidgetData.self, from: data)
  }
}

/// 위젯에 보이는 단어를 어디서 골랐는지
enum WordSource: Hashable {
  case wrongNote
  case allWords
  case wordbook(name: String)
}

struct WordPool {
  let source: WordSource
  let words: [WidgetWord]

  /// 단어장을 골랐으면 그 단어장에서, 아니면 오답 노트 → 저장한 모든 단어 순으로 고른다.
  /// 고른 단어장이 지워졌으면 고르지 않은 것처럼 동작한다.
  static func resolve(data: WidgetData?, wordbookId: String?) -> WordPool {
    guard let data else { return WordPool(source: .allWords, words: []) }

    if let wordbookId, let book = data.wordbooks.first(where: { $0.id == wordbookId }) {
      return WordPool(
        source: .wordbook(name: book.name),
        words: data.words.filter { $0.wordbookId == book.id }
      )
    }

    let wrongWords = data.words.filter(\.wrong)
    if !wrongWords.isEmpty {
      return WordPool(source: .wrongNote, words: wrongWords)
    }
    return WordPool(source: .allWords, words: data.words)
  }

  /// 단어를 무작위로 count개 고른다. 단어가 둘 이상이면 같은 단어가 연달아 나오지 않게 한다.
  func randomWords(count: Int) -> [WidgetWord] {
    guard !words.isEmpty else { return [] }

    var picked: [WidgetWord] = []
    for _ in 0..<count {
      var next = words.randomElement()!
      while words.count > 1, next.id == picked.last?.id {
        next = words.randomElement()!
      }
      picked.append(next)
    }
    return picked
  }
}
