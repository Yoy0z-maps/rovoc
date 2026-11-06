package com.yoy0zmaps.rovoc.widget

import android.content.Context
import org.json.JSONObject

// 앱(lib/widgetPayload.ts)이 저장하는 데이터
internal data class WidgetWord(
  val id: String,
  val text: String,
  val part: String,
  val meaning: String,
  val example: String,
  val wordbookId: String,
  val wrong: Boolean,
)

internal data class WidgetWordbook(val id: String, val name: String)

internal data class WidgetData(val wordbooks: List<WidgetWordbook>, val words: List<WidgetWord>)

/** 위젯에 보이는 단어를 어디서 골랐는지 */
internal sealed interface WordSource {
  data object WrongNote : WordSource
  data object AllWords : WordSource
  data class Wordbook(val name: String) : WordSource
}

internal data class WordPool(val source: WordSource, val words: List<WidgetWord>) {
  /** 무작위로 한 단어를 고른다. 단어가 둘 이상이면 지금 보이는 단어는 피한다. */
  fun randomWord(exceptId: String?): WidgetWord? {
    val candidates = if (words.size > 1) words.filter { it.id != exceptId } else words
    return candidates.randomOrNull()
  }

  companion object {
    /**
     * 단어장을 골랐으면 그 단어장에서, 아니면 오답 노트 → 저장한 모든 단어 순으로 고른다.
     * 고른 단어장이 지워졌으면 고르지 않은 것처럼 동작한다.
     */
    fun resolve(data: WidgetData?, wordbookId: String?): WordPool {
      if (data == null) return WordPool(WordSource.AllWords, emptyList())

      val book = wordbookId?.let { id -> data.wordbooks.firstOrNull { it.id == id } }
      if (book != null) {
        return WordPool(WordSource.Wordbook(book.name), data.words.filter { it.wordbookId == book.id })
      }

      val wrongWords = data.words.filter { it.wrong }
      if (wrongWords.isNotEmpty()) return WordPool(WordSource.WrongNote, wrongWords)
      return WordPool(WordSource.AllWords, data.words)
    }
  }
}

internal object WidgetStore {
  private const val PREFERENCES = "rovoca_widget"
  private const val DATA_KEY = "widgetData"

  private fun wordbookKey(widgetId: Int) = "wordbook_$widgetId"
  private fun currentWordKey(widgetId: Int) = "word_$widgetId"

  private fun preferences(context: Context) =
    context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)

  fun saveData(context: Context, json: String) {
    preferences(context).edit().putString(DATA_KEY, json).apply()
  }

  fun loadData(context: Context): WidgetData? {
    val json = preferences(context).getString(DATA_KEY, null) ?: return null
    return runCatching { parse(JSONObject(json)) }.getOrNull()
  }

  /** 위젯에서 고른 단어장 (null이면 자동) */
  fun wordbookId(context: Context, widgetId: Int): String? =
    preferences(context).getString(wordbookKey(widgetId), null)

  fun setWordbookId(context: Context, widgetId: Int, wordbookId: String?) {
    preferences(context).edit().apply {
      if (wordbookId == null) remove(wordbookKey(widgetId)) else putString(wordbookKey(widgetId), wordbookId)
    }.apply()
  }

  /** 크기만 바뀌었을 때 같은 단어를 다시 그리려고 지금 보이는 단어를 기억한다 */
  fun currentWordId(context: Context, widgetId: Int): String? =
    preferences(context).getString(currentWordKey(widgetId), null)

  fun setCurrentWordId(context: Context, widgetId: Int, wordId: String?) {
    preferences(context).edit().apply {
      if (wordId == null) remove(currentWordKey(widgetId)) else putString(currentWordKey(widgetId), wordId)
    }.apply()
  }

  fun remove(context: Context, widgetIds: IntArray) {
    preferences(context).edit().apply {
      widgetIds.forEach {
        remove(wordbookKey(it))
        remove(currentWordKey(it))
      }
    }.apply()
  }

  private fun parse(json: JSONObject): WidgetData {
    val wordbooks = json.optJSONArray("wordbooks")
    val words = json.optJSONArray("words")
    return WidgetData(
      wordbooks = List(wordbooks?.length() ?: 0) { index ->
        val item = wordbooks!!.getJSONObject(index)
        WidgetWordbook(id = item.optString("id"), name = item.optString("name"))
      },
      words = List(words?.length() ?: 0) { index ->
        val item = words!!.getJSONObject(index)
        WidgetWord(
          id = item.optString("id"),
          text = item.optString("text"),
          part = item.optString("part"),
          meaning = item.optString("meaning"),
          example = item.optString("example"),
          wordbookId = item.optString("wordbookId"),
          wrong = item.optBoolean("wrong"),
        )
      },
    )
  }
}
