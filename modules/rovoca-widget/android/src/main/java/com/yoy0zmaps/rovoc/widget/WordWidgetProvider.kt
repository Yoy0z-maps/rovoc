package com.yoy0zmaps.rovoc.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.appwidget.AppWidgetProviderInfo
import android.content.ComponentName
import android.content.Context
import android.os.Bundle
import android.view.View
import android.widget.RemoteViews

/** 홈 화면 단어 카드 (잠금화면에 놓으면 잠금화면 모양으로 그린다) */
open class WordWidgetProvider : AppWidgetProvider() {
  // 시스템이 주기적으로 부를 때마다 새 단어를 보여준다
  override fun onUpdate(context: Context, manager: AppWidgetManager, widgetIds: IntArray) {
    WordWidgets.update(context, manager, widgetIds, pickNewWord = true)
  }

  // 크기만 바뀌었으면 보이던 단어를 그대로 다시 그린다
  override fun onAppWidgetOptionsChanged(
    context: Context,
    manager: AppWidgetManager,
    widgetId: Int,
    options: Bundle,
  ) {
    WordWidgets.update(context, manager, intArrayOf(widgetId), pickNewWord = false)
  }

  override fun onDeleted(context: Context, widgetIds: IntArray) {
    WidgetStore.remove(context, widgetIds)
  }
}

/** 잠금화면용 한 줄 카드 (홈 화면에도 놓을 수 있다) */
class WordLockWidgetProvider : WordWidgetProvider()

internal object WordWidgets {
  // 이보다 좁으면 작은 카드(2칸)로 그린다
  private const val SMALL_WIDTH_DP = 200

  /** 앱에서 단어가 바뀌면 모든 위젯을 새 단어로 다시 그린다 */
  fun refreshAll(context: Context) {
    val manager = AppWidgetManager.getInstance(context)
    val widgetIds = listOf(WordWidgetProvider::class.java, WordLockWidgetProvider::class.java)
      .flatMap { manager.getAppWidgetIds(ComponentName(context, it)).toList() }
      .toIntArray()
    if (widgetIds.isNotEmpty()) update(context, manager, widgetIds, pickNewWord = true)
  }

  fun update(context: Context, manager: AppWidgetManager, widgetIds: IntArray, pickNewWord: Boolean) {
    val data = WidgetStore.loadData(context)
    for (widgetId in widgetIds) {
      val pool = WordPool.resolve(data, WidgetStore.wordbookId(context, widgetId))
      val currentId = WidgetStore.currentWordId(context, widgetId)
      val keptWord = if (pickNewWord) null else pool.words.firstOrNull { it.id == currentId }
      val word = keptWord ?: pool.randomWord(exceptId = currentId)
      WidgetStore.setCurrentWordId(context, widgetId, word?.id)

      manager.updateAppWidget(widgetId, render(context, manager, widgetId, pool.source, word))
    }
  }

  private fun render(
    context: Context,
    manager: AppWidgetManager,
    widgetId: Int,
    source: WordSource,
    word: WidgetWord?,
  ): RemoteViews {
    val options = manager.getAppWidgetOptions(widgetId)
    val isLockProvider =
      manager.getAppWidgetInfo(widgetId)?.provider?.className == WordLockWidgetProvider::class.java.name
    val onKeyguard =
      options.getInt(AppWidgetManager.OPTION_APPWIDGET_HOST_CATEGORY, -1) ==
        AppWidgetProviderInfo.WIDGET_CATEGORY_KEYGUARD
    if (isLockProvider || onKeyguard) return lockViews(context, source, word)

    // 세로·가로 화면에서 위젯 폭이 다르므로 두 모양을 함께 넘긴다
    val portraitWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 250)
    val landscapeWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH, portraitWidth)
    return RemoteViews(
      cardViews(context, source, word, small = landscapeWidth < SMALL_WIDTH_DP),
      cardViews(context, source, word, small = portraitWidth < SMALL_WIDTH_DP),
    )
  }

  private fun cardViews(context: Context, source: WordSource, word: WidgetWord?, small: Boolean): RemoteViews {
    val layout = if (small) R.layout.rovoca_widget_card_small else R.layout.rovoca_widget_card
    val views = RemoteViews(context.packageName, layout)

    views.setInt(
      R.id.widget_root,
      "setBackgroundResource",
      if (source == WordSource.WrongNote) {
        R.drawable.rovoca_widget_card_background_wrong
      } else {
        R.drawable.rovoca_widget_card_background
      },
    )
    views.setImageViewResource(R.id.widget_source_icon, source.icon)
    views.setInt(R.id.widget_source_icon, "setColorFilter", context.getColor(source.tint))
    views.setTextViewText(R.id.widget_source, source.title(context))

    if (word == null) {
      views.setTextViewText(R.id.widget_word, emptyTitle(context, source))
      views.setTextViewText(R.id.widget_empty_message, context.getString(R.string.rovoca_widget_empty_message))
      views.setViewVisibility(R.id.widget_empty_message, View.VISIBLE)
      views.setViewVisibility(R.id.widget_part, View.GONE)
      views.setViewVisibility(R.id.widget_meaning_box, View.GONE)
    } else {
      views.setTextViewText(R.id.widget_word, word.text)
      views.setViewVisibility(R.id.widget_empty_message, View.GONE)
      views.setTextOrHide(R.id.widget_part, word.part)
      views.setTextOrHide(R.id.widget_meaning, word.meaning)
      if (small) {
        views.setViewVisibility(R.id.widget_meaning_box, if (word.meaning.isEmpty()) View.GONE else View.VISIBLE)
      } else {
        views.setTextOrHide(R.id.widget_example, word.example)
        views.setViewVisibility(
          R.id.widget_meaning_box,
          if (word.meaning.isEmpty() && word.example.isEmpty()) View.GONE else View.VISIBLE,
        )
        views.setInt(R.id.widget_meaning, "setMaxLines", if (word.example.isEmpty()) 2 else 1)
      }
    }

    views.setOnClickPendingIntent(R.id.widget_root, openAppIntent(context))
    return views
  }

  private fun lockViews(context: Context, source: WordSource, word: WidgetWord?): RemoteViews {
    val views = RemoteViews(context.packageName, R.layout.rovoca_widget_lock)
    if (word == null) {
      views.setTextViewText(R.id.widget_word, emptyTitle(context, source))
      views.setTextOrHide(R.id.widget_meaning, context.getString(R.string.rovoca_widget_empty_message))
    } else {
      views.setTextViewText(R.id.widget_word, word.text)
      views.setTextOrHide(R.id.widget_meaning, word.meaning)
    }
    views.setOnClickPendingIntent(R.id.widget_root, openAppIntent(context))
    return views
  }

  private fun emptyTitle(context: Context, source: WordSource) = context.getString(
    if (source is WordSource.Wordbook) {
      R.string.rovoca_widget_empty_wordbook_title
    } else {
      R.string.rovoca_widget_empty_title
    },
  )

  private fun openAppIntent(context: Context): PendingIntent? {
    val intent = context.packageManager.getLaunchIntentForPackage(context.packageName) ?: return null
    return PendingIntent.getActivity(
      context,
      0,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }

  private fun RemoteViews.setTextOrHide(viewId: Int, text: String) {
    setTextViewText(viewId, text)
    setViewVisibility(viewId, if (text.isEmpty()) View.GONE else View.VISIBLE)
  }

  private val WordSource.icon: Int
    get() = when (this) {
      WordSource.WrongNote -> R.drawable.rovoca_widget_ic_wrong_note
      WordSource.AllWords -> R.drawable.rovoca_widget_ic_bookmark
      is WordSource.Wordbook -> R.drawable.rovoca_widget_ic_book
    }

  private val WordSource.tint: Int
    get() = if (this == WordSource.WrongNote) R.color.rovoca_widget_red else R.color.rovoca_widget_blue

  private fun WordSource.title(context: Context): String = when (this) {
    WordSource.WrongNote -> context.getString(R.string.rovoca_widget_wrong_note)
    WordSource.AllWords -> context.getString(R.string.rovoca_widget_my_words)
    is WordSource.Wordbook -> name
  }
}
