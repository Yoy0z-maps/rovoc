package com.yoy0zmaps.rovoc.widget

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView

/** 위젯을 추가하거나 다시 설정할 때 단어를 뽑을 단어장을 고른다 */
class WordWidgetConfigureActivity : Activity() {
  private var widgetId = AppWidgetManager.INVALID_APPWIDGET_ID

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // 고르지 않고 나가면 위젯을 추가하지 않는다 (다시 설정 중이면 원래 설정을 유지한다)
    setResult(RESULT_CANCELED)

    widgetId = intent?.extras?.getInt(
      AppWidgetManager.EXTRA_APPWIDGET_ID,
      AppWidgetManager.INVALID_APPWIDGET_ID,
    ) ?: AppWidgetManager.INVALID_APPWIDGET_ID
    if (widgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
      finish()
      return
    }

    setContentView(R.layout.rovoca_widget_configure)
    window.setLayout((resources.displayMetrics.widthPixels * 0.9).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)
    findViewById<View>(R.id.configure_cancel).setOnClickListener { finish() }
    renderOptions()
  }

  private fun renderOptions() {
    val data = WidgetStore.loadData(this)
    val selectedId = WidgetStore.wordbookId(this, widgetId)
      ?.takeIf { id -> data?.wordbooks?.any { it.id == id } == true }
    val list = findViewById<LinearLayout>(R.id.configure_options)

    addOption(
      list,
      title = getString(R.string.rovoca_widget_automatic),
      subtitle = getString(R.string.rovoca_widget_automatic_description),
      selected = selectedId == null,
    ) { choose(null) }

    val wordbooks = data?.wordbooks.orEmpty()
    for (book in wordbooks) {
      val count = data?.words?.count { it.wordbookId == book.id } ?: 0
      addOption(
        list,
        title = book.name,
        subtitle = resources.getQuantityString(R.plurals.rovoca_widget_word_count, count, count),
        selected = book.id == selectedId,
      ) { choose(book.id) }
    }

    findViewById<View>(R.id.configure_no_wordbooks).visibility =
      if (wordbooks.isEmpty()) View.VISIBLE else View.GONE
  }

  private fun addOption(
    list: LinearLayout,
    title: String,
    subtitle: String,
    selected: Boolean,
    onClick: () -> Unit,
  ) {
    val row = layoutInflater.inflate(R.layout.rovoca_widget_configure_item, list, false)
    row.findViewById<TextView>(R.id.option_title).text = title
    row.findViewById<TextView>(R.id.option_subtitle).text = subtitle
    row.findViewById<View>(R.id.option_check).visibility = if (selected) View.VISIBLE else View.INVISIBLE
    row.setOnClickListener { onClick() }
    list.addView(row)
  }

  private fun choose(wordbookId: String?) {
    WidgetStore.setWordbookId(this, widgetId, wordbookId)
    WordWidgets.update(this, AppWidgetManager.getInstance(this), intArrayOf(widgetId), pickNewWord = true)
    setResult(RESULT_OK, Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId))
    finish()
  }
}
