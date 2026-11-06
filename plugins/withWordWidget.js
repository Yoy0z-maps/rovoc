const fs = require("fs");
const path = require("path");
const { withEntitlementsPlist, withXcodeProject } = require("expo/config-plugins");

// iOS 홈·잠금화면 위젯 확장을 Xcode 프로젝트에 넣는다.
// 원본은 modules/rovoca-widget/extension에 있고, prebuild 때마다 ios/RovocaWidgetExtension으로 복사한다.
// (안드로이드 위젯은 modules/rovoca-widget/android 라이브러리의 매니페스트가 앱에 합쳐지므로 여기서 할 일이 없다)

const TARGET_NAME = "RovocaWidgetExtension";
const APP_GROUP = "group.com.yoy0zmaps.rovoc";
const SOURCE_DIR = "modules/rovoca-widget/extension";
// 위젯 편집에서 단어장을 고르는 AppIntent 설정이 iOS 17부터라 위젯만 17 이상에서 보인다 (앱은 그대로)
const DEPLOYMENT_TARGET = "17.0";
const SOURCE_FILES = [
  "RovocaWidgetBundle.swift",
  "WordWidget.swift",
  "WidgetData.swift",
  "WordbookIntent.swift",
];
const RESOURCE_FILES = ["Localizable.xcstrings"];
const OTHER_FILES = ["Info.plist", `${TARGET_NAME}.entitlements`];
const FILE_TYPES = {
  ".swift": "sourcecode.swift",
  ".xcstrings": "text.json.xcstrings",
  ".plist": "text.plist.xml",
  ".entitlements": "text.plist.entitlements",
};

const unquote = (value) => String(value ?? "").replace(/^"|"$/g, "");
const quote = (value) => `"${value}"`;
const isObject = (key, value) => !key.endsWith("_comment") && value && typeof value === "object";

const widgetBundleIdentifier = (config) => `${config.ios.bundleIdentifier}.widget`;

function copyExtensionSources(projectRoot, platformProjectRoot) {
  const destination = path.join(platformProjectRoot, TARGET_NAME);
  fs.rmSync(destination, { force: true, recursive: true });
  fs.cpSync(path.join(projectRoot, SOURCE_DIR), destination, { recursive: true });
}

function findTargetUuid(project) {
  const targets = project.pbxNativeTargetSection();
  return (
    Object.keys(targets).find(
      (key) => isObject(key, targets[key]) && unquote(targets[key].name) === TARGET_NAME
    ) ?? null
  );
}

function ensureGroup(project) {
  const existing = project.findPBXGroupKey({ name: TARGET_NAME });
  if (existing) return existing;

  const uuid = project.generateUuid();
  const groups = project.hash.project.objects.PBXGroup;
  groups[uuid] = { isa: "PBXGroup", children: [], name: TARGET_NAME, sourceTree: '"<group>"' };
  groups[`${uuid}_comment`] = TARGET_NAME;
  project.addToPbxGroup(uuid, project.getFirstProject().firstProject.mainGroup);
  return uuid;
}

function ensureFileReference(project, groupUuid, fileName) {
  const filePath = `${TARGET_NAME}/${fileName}`;
  const references = project.pbxFileReferenceSection();
  const existing = Object.keys(references).find(
    (key) => isObject(key, references[key]) && unquote(references[key].path) === filePath
  );
  if (existing) return existing;

  const uuid = project.generateUuid();
  references[uuid] = {
    isa: "PBXFileReference",
    lastKnownFileType: FILE_TYPES[path.extname(fileName)],
    name: quote(fileName),
    path: quote(filePath),
    sourceTree: '"<group>"',
  };
  references[`${uuid}_comment`] = fileName;
  project.getPBXGroupByKey(groupUuid).children.push({ value: uuid, comment: fileName });
  return uuid;
}

function ensureBuildPhase(project, targetUuid, isa, name) {
  const target = project.pbxNativeTargetSection()[targetUuid];
  const existing = target.buildPhases.find((phase) => phase.comment === name);
  const uuid = existing
    ? existing.value
    : project.addBuildPhase([], isa, name, targetUuid).uuid;
  return project.hash.project.objects[isa][uuid];
}

function ensureBuildFile(project, phase, phaseName, fileRefUuid, fileName) {
  const buildFiles = project.pbxBuildFileSection();
  const alreadyAdded = phase.files.some((file) => buildFiles[file.value]?.fileRef === fileRefUuid);
  if (alreadyAdded) return;

  const uuid = project.generateUuid();
  const comment = `${fileName} in ${phaseName}`;
  buildFiles[uuid] = { isa: "PBXBuildFile", fileRef: fileRefUuid, fileRef_comment: fileName };
  buildFiles[`${uuid}_comment`] = comment;
  phase.files.push({ value: uuid, comment });
}

function buildConfigurations(project, targetUuid) {
  const target = project.pbxNativeTargetSection()[targetUuid];
  const configList = project.pbxXCConfigurationList()[target.buildConfigurationList];
  const configs = project.pbxXCBuildConfigurationSection();
  return configList.buildConfigurations.map((ref) => configs[ref.value]).filter(Boolean);
}

function firstBuildSetting(project, targetUuid, name) {
  for (const config of buildConfigurations(project, targetUuid)) {
    if (config.buildSettings[name]) return config.buildSettings[name];
  }
  return null;
}

// 위젯을 앱에 넣는 단계가 맨 뒤(RN 번들 스크립트 뒤)에 있으면 Xcode가 빌드 순환으로 판단할 수 있어 Resources 바로 뒤로 옮긴다
function moveEmbedPhaseAfterResources(project, appTargetUuid) {
  const appTarget = project.pbxNativeTargetSection()[appTargetUuid];
  const copyPhases = project.hash.project.objects.PBXCopyFilesBuildPhase ?? {};
  const embedIndex = appTarget.buildPhases.findIndex((phase) =>
    (copyPhases[phase.value]?.files ?? []).some((file) => file.comment?.startsWith(`${TARGET_NAME}.appex`))
  );
  const resourcesIndex = appTarget.buildPhases.findIndex((phase) => phase.comment === "Resources");
  if (embedIndex === -1 || resourcesIndex === -1 || embedIndex === resourcesIndex + 1) return;

  const [embedPhase] = appTarget.buildPhases.splice(embedIndex, 1);
  const insertAt = appTarget.buildPhases.findIndex((phase) => phase.comment === "Resources") + 1;
  appTarget.buildPhases.splice(insertAt, 0, embedPhase);
}

function integrateWidgetTarget(project, config) {
  const appTargetUuid = project.getFirstTarget().uuid;
  const bundleIdentifier = widgetBundleIdentifier(config);

  let targetUuid = findTargetUuid(project);
  if (!targetUuid) {
    targetUuid = project.addTarget(TARGET_NAME, "app_extension", TARGET_NAME, bundleIdentifier).uuid;
  }
  // addTarget이 만드는 .appex 참조에 'undefined' 값이 그대로 들어가므로 지운다
  const productReference =
    project.pbxFileReferenceSection()[project.pbxNativeTargetSection()[targetUuid].productReference];
  for (const key of ["fileEncoding", "lastKnownFileType"]) {
    if (productReference && String(productReference[key]) === "undefined") delete productReference[key];
  }
  moveEmbedPhaseAfterResources(project, appTargetUuid);

  const groupUuid = ensureGroup(project);
  const sources = ensureBuildPhase(project, targetUuid, "PBXSourcesBuildPhase", "Sources");
  const resources = ensureBuildPhase(project, targetUuid, "PBXResourcesBuildPhase", "Resources");
  for (const fileName of SOURCE_FILES) {
    ensureBuildFile(project, sources, "Sources", ensureFileReference(project, groupUuid, fileName), fileName);
  }
  for (const fileName of RESOURCE_FILES) {
    ensureBuildFile(project, resources, "Resources", ensureFileReference(project, groupUuid, fileName), fileName);
  }
  for (const fileName of OTHER_FILES) {
    ensureFileReference(project, groupUuid, fileName);
  }

  // 서명 팀·방식은 앱 타깃과 맞춘다 (EAS Build는 빌드할 때 다시 설정한다)
  const developmentTeam = firstBuildSetting(project, appTargetUuid, "DEVELOPMENT_TEAM");
  const codeSignStyle = firstBuildSetting(project, appTargetUuid, "CODE_SIGN_STYLE");

  for (const buildConfig of buildConfigurations(project, targetUuid)) {
    Object.assign(buildConfig.buildSettings, {
      APPLICATION_EXTENSION_API_ONLY: "YES",
      CODE_SIGN_ENTITLEMENTS: `${TARGET_NAME}/${TARGET_NAME}.entitlements`,
      CURRENT_PROJECT_VERSION: quote(config.ios.buildNumber ?? "1"),
      GENERATE_INFOPLIST_FILE: "NO",
      INFOPLIST_FILE: `${TARGET_NAME}/Info.plist`,
      IPHONEOS_DEPLOYMENT_TARGET: DEPLOYMENT_TARGET,
      LD_RUNPATH_SEARCH_PATHS: '"$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"',
      LOCALIZATION_PREFERS_STRING_CATALOGS: "YES",
      MARKETING_VERSION: config.version,
      PRODUCT_BUNDLE_IDENTIFIER: bundleIdentifier,
      PRODUCT_NAME: '"$(TARGET_NAME)"',
      SKIP_INSTALL: "YES",
      SWIFT_EMIT_LOC_STRINGS: "YES",
      SWIFT_VERSION: "5.0",
      TARGETED_DEVICE_FAMILY: '"1,2"',
    });
    if (developmentTeam) buildConfig.buildSettings.DEVELOPMENT_TEAM = developmentTeam;
    if (codeSignStyle) buildConfig.buildSettings.CODE_SIGN_STYLE = codeSignStyle;
  }

  // 위젯 문구(Localizable.xcstrings)의 한국어·중국어를 빌드에 넣는다
  for (const region of ["ko", "zh-Hans"]) project.addKnownRegion(region);
}

module.exports = function withWordWidget(config) {
  config = withEntitlementsPlist(config, (config) => {
    const groups = config.modResults["com.apple.security.application-groups"] ?? [];
    if (!groups.includes(APP_GROUP)) {
      config.modResults["com.apple.security.application-groups"] = [...groups, APP_GROUP];
    }
    return config;
  });

  config = withXcodeProject(config, (config) => {
    copyExtensionSources(config.modRequest.projectRoot, config.modRequest.platformProjectRoot);
    integrateWidgetTarget(config.modResults, config);
    return config;
  });

  // EAS Build가 위젯 확장의 번들 ID·프로비저닝 프로파일도 만들도록 알려준다
  const eas = config.extra?.eas ?? {};
  const experimentalIos = eas.build?.experimental?.ios ?? {};
  const otherExtensions = (experimentalIos.appExtensions ?? []).filter(
    (extension) => extension.targetName !== TARGET_NAME
  );
  config.extra = {
    ...config.extra,
    eas: {
      ...eas,
      build: {
        ...eas.build,
        experimental: {
          ...eas.build?.experimental,
          ios: {
            ...experimentalIos,
            appExtensions: [
              ...otherExtensions,
              {
                targetName: TARGET_NAME,
                bundleIdentifier: widgetBundleIdentifier(config),
                entitlements: { "com.apple.security.application-groups": [APP_GROUP] },
              },
            ],
          },
        },
      },
    },
  };

  return config;
};
