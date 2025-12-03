#!/usr/bin/env node

/**
 * React Native Auto Versioning Script
 * -----------------------------------
 * Updates:
 *  - Android: versionCode + versionName (app/build.gradle)
 *  - iOS: CFBundleVersion + CFBundleShortVersionString (Info.plist)
 *
 * Version Types:
 *  patch → 1.0.(x+1) #1.0.0 → 1.0.1
 *  minor → 1.(x+1).0 #1.0.1 → 1.1.0
 *  major → (x+1).0.0 #1.1.0 → 2.0.0
 */

const fs = require('fs');
const path = require('path');
const plist = require('plist');

const bumpType = process.argv[2] || 'patch';

// ---------------------- VERSION BUMPER ----------------------
function bump(version, type) {
  let [major, minor, patch] = version.split('.').map(Number);

  if (type === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (type === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
}

// ---------------------- ANDROID UPDATER ----------------------
function updateAndroid(versionName, versionCode) {
  const gradlePath = './android/app/build.gradle';
  let gradle = fs.readFileSync(gradlePath, 'utf8');

  gradle = gradle.replace(/versionName ".*"/, `versionName "${versionName}"`);
  gradle = gradle.replace(/versionCode \d+/, `versionCode ${versionCode}`);

  fs.writeFileSync(gradlePath, gradle);

  console.log(
    `✓ Android updated → versionName: ${versionName}, versionCode: ${versionCode}`,
  );
}

// ---------------------- iOS FILE DETECTOR ----------------------
function detectIOSPlist() {
  const iosDir = './ios';
  const folders = fs.readdirSync(iosDir);

  for (const folder of folders) {
    const plistPath = path.join(iosDir, folder, 'Info.plist');
    if (fs.existsSync(plistPath)) {
      return plistPath;
    }
  }

  console.error('❌ Info.plist not found. Check your iOS project structure.');
  process.exit(1);
}

// ---------------------- iOS UPDATER ----------------------
function updateIOS(versionName, versionCode) {
  const infoPlistPath = detectIOSPlist();
  const xml = fs.readFileSync(infoPlistPath, 'utf8');

  const plistObj = plist.parse(xml);

  plistObj.CFBundleShortVersionString = versionName;
  plistObj.CFBundleVersion = String(versionCode);

  fs.writeFileSync(infoPlistPath, plist.build(plistObj));

  console.log(
    `✓ iOS updated → CFBundleShortVersionString: ${versionName}, CFBundleVersion: ${versionCode}`,
  );
}

// ---------------------- MAIN EXECUTION ----------------------
function run() {
  const versionFile = './version.json';

  // Create version.json if missing
  if (!fs.existsSync(versionFile)) {
    fs.writeFileSync(
      versionFile,
      JSON.stringify(
        {
          versionName: '1.0.0',
          versionCode: 1,
        },
        null,
        2,
      ),
    );
  }

  const data = JSON.parse(fs.readFileSync(versionFile));

  const newVersionName = bump(data.versionName, bumpType);
  const newVersionCode = data.versionCode + 1;

  updateAndroid(newVersionName, newVersionCode);
  updateIOS(newVersionName, newVersionCode);

  fs.writeFileSync(
    versionFile,
    JSON.stringify(
      {
        versionName: newVersionName,
        versionCode: newVersionCode,
      },
      null,
      2,
    ),
  );

  console.log(`✓ Bumped (${bumpType}) → ${newVersionName} (${newVersionCode})`);
}

run();
