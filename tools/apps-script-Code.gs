/**
 * עתירות מדיה – רשימת קבצים לאפליקציה
 * מחזיר JSON עם כל הקבצים שבתיקיות התחומים, כדי שהאפליקציה תציג אותם לבד.
 * לא משנה שום דבר בדרייב – רק קורא.
 */
var ROOT_FOLDER_ID = '1Y4Tq_vpKxon9Sgof1rPn18ztIyA_a8i7'; // התיקייה "עתירות מדיה – אפליקציה"

function doGet(e) {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('files');
  if (hit) return out_(hit);
  var root = DriveApp.getFolderById(ROOT_FOLDER_ID);
  var data = { updated: new Date().toISOString(), source: 'apps-script', folders: [] };
  var subs = root.getFolders();
  while (subs.hasNext()) {
    var f = subs.next();
    var files = [];
    var it = f.getFiles();
    while (it.hasNext()) {
      var x = it.next();
      if (x.isTrashed()) continue;
      files.push({ id: x.getId(), name: x.getName(), url: x.getUrl(),
                   mimeType: x.getMimeType(), modified: x.getLastUpdated().toISOString() });
    }
    files.sort(function (a, b) { return a.modified < b.modified ? 1 : -1; });
    data.folders.push({ id: f.getId(), name: f.getName(), files: files });
  }
  var json = JSON.stringify(data);
  try { cache.put('files', json, 60); } catch (err) {}
  return out_(json);
}

function out_(json) {
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
