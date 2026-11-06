import SwiftUI
import WidgetKit

struct WordEntry: TimelineEntry {
  let date: Date
  let source: WordSource
  let word: WidgetWord?

  static var sample: WordEntry {
    WordEntry(
      date: Date(),
      source: .wrongNote,
      word: WidgetWord(
        id: "sample",
        text: "serendipity",
        part: "noun",
        meaning: String(localized: "a happy accident"),
        example: "Finding this café was pure serendipity.",
        wordbookId: "",
        wrong: true
      )
    )
  }
}

struct WordProvider: AppIntentTimelineProvider {
  // 단어를 바꿔 보여주는 간격과 미리 만들어 두는 개수 (6시간치)
  private let rotationInterval: TimeInterval = 30 * 60
  private let entryCount = 12

  func placeholder(in context: Context) -> WordEntry {
    .sample
  }

  func snapshot(for configuration: WordWidgetIntent, in context: Context) async -> WordEntry {
    let pool = WordPool.resolve(data: WidgetData.load(), wordbookId: configuration.wordbookId)
    // 위젯 갤러리에서는 저장한 단어가 없어도 어떤 모습인지 보여준다
    if context.isPreview && pool.words.isEmpty {
      return .sample
    }
    return WordEntry(date: Date(), source: pool.source, word: pool.randomWords(count: 1).first)
  }

  func timeline(for configuration: WordWidgetIntent, in context: Context) async -> Timeline<WordEntry> {
    let pool = WordPool.resolve(data: WidgetData.load(), wordbookId: configuration.wordbookId)
    let now = Date()

    // 바꿔 보여줄 단어가 없으면 앱이 데이터를 바꿀 때만 다시 그린다
    guard pool.words.count > 1 else {
      let entry = WordEntry(date: now, source: pool.source, word: pool.words.first)
      return Timeline(entries: [entry], policy: .never)
    }

    let entries = pool.randomWords(count: entryCount).enumerated().map { index, word in
      WordEntry(
        date: now.addingTimeInterval(Double(index) * rotationInterval),
        source: pool.source,
        word: word
      )
    }
    return Timeline(entries: entries, policy: .atEnd)
  }
}

struct WordWidget: Widget {
  let kind = "RovocaWordWidget"

  var body: some WidgetConfiguration {
    AppIntentConfiguration(kind: kind, intent: WordWidgetIntent.self, provider: WordProvider()) { entry in
      WordWidgetView(entry: entry)
    }
    .configurationDisplayName("Word card")
    .description("Shows a random word from your wrong answers, or from a wordbook you choose.")
    .supportedFamilies([
      .systemSmall,
      .systemMedium,
      .accessoryCircular,
      .accessoryRectangular,
      .accessoryInline,
    ])
  }
}

// MARK: - 화면

struct WordWidgetView: View {
  @Environment(\.widgetFamily) private var family

  let entry: WordEntry

  var body: some View {
    content
      .containerBackground(for: .widget) {
        switch family {
        case .systemSmall, .systemMedium:
          entry.source.background
        default:
          Color.clear
        }
      }
  }

  @ViewBuilder
  private var content: some View {
    switch family {
    case .systemSmall:
      SmallWordView(entry: entry)
    case .accessoryCircular:
      CircularWordView(word: entry.word)
    case .accessoryRectangular:
      RectangularWordView(word: entry.word)
    case .accessoryInline:
      InlineWordView(word: entry.word)
    default:
      MediumWordView(entry: entry)
    }
  }
}

private struct SmallWordView: View {
  let entry: WordEntry

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      SourceLabel(source: entry.source)
      Spacer(minLength: 6)

      if let word = entry.word {
        Text(word.text)
          .font(.system(size: 26, weight: .bold))
          .foregroundStyle(Palette.ink)
          .lineLimit(1)
          .minimumScaleFactor(0.5)

        if !word.part.isEmpty {
          PartChip(part: word.part)
            .padding(.top, 4)
        }

        if !word.meaning.isEmpty {
          Text(word.meaning)
            .font(.system(size: 13, weight: .medium))
            .foregroundStyle(Palette.gray)
            .lineLimit(2)
            .padding(.top, 6)
        }
      } else {
        EmptyWordView(source: entry.source)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
  }
}

private struct MediumWordView: View {
  let entry: WordEntry

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      HStack(spacing: 8) {
        SourceLabel(source: entry.source)
        Spacer(minLength: 0)
        if let part = entry.word?.part, !part.isEmpty {
          PartChip(part: part)
        }
      }
      Spacer(minLength: 6)

      if let word = entry.word {
        Text(word.text)
          .font(.system(size: 28, weight: .bold))
          .foregroundStyle(Palette.ink)
          .lineLimit(1)
          .minimumScaleFactor(0.5)

        if !word.meaning.isEmpty || !word.example.isEmpty {
          VStack(alignment: .leading, spacing: 3) {
            if !word.meaning.isEmpty {
              Text(word.meaning)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(Palette.ink)
                .lineLimit(word.example.isEmpty ? 2 : 1)
            }
            if !word.example.isEmpty {
              Text(word.example)
                .font(.system(size: 12))
                .italic()
                .foregroundStyle(Palette.gray)
                .lineLimit(1)
            }
          }
          .inkCard()
          .padding(.top, 8)
        }
      } else {
        EmptyWordView(source: entry.source)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
  }
}

private struct EmptyWordView: View {
  let source: WordSource

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      Group {
        if case .wordbook = source {
          Text("No words in this wordbook yet")
        } else {
          Text("Add your first word")
        }
      }
      .font(.system(size: 15, weight: .bold))
      .foregroundStyle(Palette.ink)
      .lineLimit(2)

      Text("Words you save in the app will show up here.")
        .font(.system(size: 12))
        .foregroundStyle(Palette.gray)
        .lineLimit(3)
    }
  }
}

// MARK: - 잠금화면

private struct RectangularWordView: View {
  let word: WidgetWord?

  var body: some View {
    VStack(alignment: .leading, spacing: 1) {
      if let word {
        Text(word.text)
          .font(.headline)
          .widgetAccentable()
          .lineLimit(1)
          .minimumScaleFactor(0.6)
        if !word.meaning.isEmpty {
          Text(word.meaning)
            .font(.caption)
            .foregroundStyle(.secondary)
            .lineLimit(2)
        }
      } else {
        Text("Add your first word")
          .font(.headline)
          .lineLimit(1)
          .minimumScaleFactor(0.6)
        Text("Words you save in the app will show up here.")
          .font(.caption)
          .foregroundStyle(.secondary)
          .lineLimit(2)
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct InlineWordView: View {
  let word: WidgetWord?

  var body: some View {
    if let word {
      Text(word.meaning.isEmpty ? word.text : "\(word.text) · \(word.meaning)")
    } else {
      Text("Add your first word")
    }
  }
}

private struct CircularWordView: View {
  let word: WidgetWord?

  var body: some View {
    ZStack {
      AccessoryWidgetBackground()
      if let word {
        Text(word.text)
          .font(.system(size: 14, weight: .bold))
          .multilineTextAlignment(.center)
          .lineLimit(2)
          .minimumScaleFactor(0.4)
          .padding(6)
      } else {
        Image(systemName: "character.book.closed.fill")
          .font(.title3)
      }
    }
  }
}

// MARK: - 공통 요소 (앱 카드와 같은 색·테두리)

private struct SourceLabel: View {
  let source: WordSource

  var body: some View {
    HStack(spacing: 4) {
      Image(systemName: source.symbol)
        .font(.system(size: 11, weight: .bold))
        .foregroundStyle(source.tint)
      Text(source.title)
        .font(.system(size: 12, weight: .semibold))
        .foregroundStyle(Palette.gray)
        .lineLimit(1)
    }
  }
}

private struct PartChip: View {
  let part: String

  var body: some View {
    Text(part)
      .font(.system(size: 11, weight: .semibold))
      .foregroundStyle(Palette.blue)
      .lineLimit(1)
      .padding(.horizontal, 7)
      .padding(.vertical, 3)
      .background(Capsule().fill(Palette.blue.opacity(0.1)))
  }
}

private extension View {
  /// 앱 카드처럼 검은 테두리에 오른쪽·아래쪽이 더 두꺼운 상자
  func inkCard() -> some View {
    let shape = RoundedRectangle(cornerRadius: 10, style: .continuous)
    return padding(.horizontal, 12)
      .padding(.vertical, 9)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(shape.fill(Color.white))
      .overlay(shape.strokeBorder(Palette.ink, lineWidth: 1.5))
      .background(shape.fill(Palette.ink).offset(x: 2, y: 2))
  }
}

private extension WordSource {
  var title: String {
    switch self {
    case .wrongNote:
      return String(localized: "Wrong Answers")
    case .allWords:
      return String(localized: "My words")
    case .wordbook(let name):
      return name
    }
  }

  var symbol: String {
    switch self {
    case .wrongNote:
      return "exclamationmark.circle.fill"
    case .allWords:
      return "bookmark.fill"
    case .wordbook:
      return "book.closed.fill"
    }
  }

  var tint: Color {
    self == .wrongNote ? Palette.red : Palette.blue
  }

  var background: Color {
    self == .wrongNote ? Palette.wrongNoteBackground : .white
  }
}

private enum Palette {
  static let ink = Color(hex: 0x111111)
  static let gray = Color(hex: 0x767676)
  static let blue = Color(hex: 0x2988F6)
  static let red = Color(hex: 0xF05650)
  static let wrongNoteBackground = Color(hex: 0xFFF5F4)
}

private extension Color {
  init(hex: UInt32) {
    self.init(
      red: Double((hex >> 16) & 0xFF) / 255,
      green: Double((hex >> 8) & 0xFF) / 255,
      blue: Double(hex & 0xFF) / 255
    )
  }
}
