Pod::Spec.new do |s|
  s.name           = 'RovocaWidget'
  s.version        = '1.0.0'
  s.summary        = 'Saves word data for the Rovoca home and lock screen widgets'
  s.description    = s.summary
  s.author         = 'Rovoca'
  s.homepage       = 'https://github.com/Yoy0z-maps/rovoc'
  s.license        = 'UNLICENSED'
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.9'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES'
  }

  # 위젯 확장 코드(../extension)는 앱이 아니라 위젯 타깃에서 빌드되므로 이 폴더의 파일만 넣는다
  s.source_files = "*.swift"
end
