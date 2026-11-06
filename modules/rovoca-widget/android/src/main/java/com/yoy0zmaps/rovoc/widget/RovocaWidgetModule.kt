package com.yoy0zmaps.rovoc.widget

import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// 위젯이 읽는 단어 데이터를 저장하고 화면에 있는 위젯을 다시 그린다
class RovocaWidgetModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("RovocaWidget")

    Function("setData") { json: String ->
      val context = appContext.reactContext?.applicationContext ?: throw Exceptions.ReactContextLost()
      WidgetStore.saveData(context, json)
      WordWidgets.refreshAll(context)
    }
  }
}
