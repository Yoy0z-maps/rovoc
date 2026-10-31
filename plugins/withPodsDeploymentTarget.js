const { withPodfile } = require("expo/config-plugins");

const MARKER = "# rovoca: pods deployment target";

// react_native_post_install은 pod 타깃의 배포 타깃만 올리고 리소스 번들(개인정보 매니페스트) 타깃은 그대로 둬서,
// Xcode가 지원 범위(iOS 15+) 밖이라고 경고한다. 모든 pod 타깃을 앱과 같은 배포 타깃 이상으로 맞춘다.
const POST_INSTALL_SNIPPET = `    ${MARKER}
    min_deployment_target = podfile_properties['ios.deploymentTarget'] || '15.1'
    installer.pods_project.targets.each do |pod_target|
      pod_target.build_configurations.each do |build_config|
        current_target = build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current_target && Gem::Version.new(current_target) < Gem::Version.new(min_deployment_target)
          build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = min_deployment_target
        end
      end
    end
`;

module.exports = function withPodsDeploymentTarget(config) {
  return withPodfile(config, (config) => {
    const podfile = config.modResults;
    if (podfile.contents.includes(MARKER)) return config;

    const contents = podfile.contents.replace(
      /post_install do \|installer\|\n/,
      (line) => line + POST_INSTALL_SNIPPET
    );
    if (contents === podfile.contents) {
      console.warn("withPodsDeploymentTarget: Podfile에서 post_install 블록을 찾지 못했습니다.");
    }
    podfile.contents = contents;
    return config;
  });
};
