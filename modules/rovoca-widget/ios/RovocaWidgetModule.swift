import ExpoModulesCore
import WidgetKit

// 위젯 확장과 같은 App Group에 단어 데이터를 저장하고 위젯을 다시 그린다
// (App Group과 키는 extension/WidgetData.swift와 같아야 한다)
public class RovocaWidgetModule: Module {
  static let appGroup = "group.com.yoy0zmaps.rovoc"
  static let dataKey = "widgetData"

  public func definition() -> ModuleDefinition {
    Name("RovocaWidget")

    Function("setData") { (json: String) in
      guard let defaults = UserDefaults(suiteName: RovocaWidgetModule.appGroup) else {
        throw AppGroupUnavailableException()
      }
      defaults.set(json, forKey: RovocaWidgetModule.dataKey)
      WidgetCenter.shared.reloadAllTimelines()
    }
  }
}

internal final class AppGroupUnavailableException: Exception {
  override var reason: String {
    "App Group \(RovocaWidgetModule.appGroup) is not available"
  }
}
