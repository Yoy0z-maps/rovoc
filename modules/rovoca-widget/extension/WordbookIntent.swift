import AppIntents
import WidgetKit

/// 위젯 편집 화면에서 고르는 단어장 (기본값은 '자동')
struct WordbookEntity: AppEntity {
  static let automaticID = "automatic"

  let id: String
  let name: String

  static var typeDisplayRepresentation: TypeDisplayRepresentation = "Wordbook"
  static var defaultQuery = WordbookQuery()

  var displayRepresentation: DisplayRepresentation {
    DisplayRepresentation(title: "\(name)")
  }

  /// 오답 노트 단어를, 오답 노트가 비어 있으면 저장한 모든 단어를 보여준다
  static var automatic: WordbookEntity {
    WordbookEntity(id: automaticID, name: String(localized: "Automatic (wrong answers first)"))
  }
}

struct WordbookQuery: EntityQuery {
  func entities(for identifiers: [WordbookEntity.ID]) async throws -> [WordbookEntity] {
    allEntities().filter { identifiers.contains($0.id) }
  }

  func suggestedEntities() async throws -> [WordbookEntity] {
    allEntities()
  }

  func defaultResult() async -> WordbookEntity? {
    .automatic
  }

  private func allEntities() -> [WordbookEntity] {
    let wordbooks = WidgetData.load()?.wordbooks ?? []
    return [.automatic] + wordbooks.map { WordbookEntity(id: $0.id, name: $0.name) }
  }
}

struct WordWidgetIntent: WidgetConfigurationIntent {
  static var title: LocalizedStringResource = "Word card"
  static var description = IntentDescription("Choose the wordbook to pick words from.")

  @Parameter(title: "Wordbook")
  var wordbook: WordbookEntity?

  /// 자동이면 nil
  var wordbookId: String? {
    guard let id = wordbook?.id, id != WordbookEntity.automaticID else { return nil }
    return id
  }
}
