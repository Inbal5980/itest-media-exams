#!/usr/bin/env python3
"""Refresh files.json of the itest-media-exams app from עינבל's Drive folders.

Run from a Tab turn (needs TAB_TASK_ID in env):
    python3 /home/user/tab/files/itest-media-exams/refresh_drive_files.py [--publish]
Lists every file in the subject folders under "עתירות מדיה – אפליקציה" (Drive, her account,
via the Workspace CLI), writes site/files.json in the same shape the Apps Script returns, and
with --publish republishes the site ONLY when the file list changed. Prints a one-line JSON result.
"""
import json, os, subprocess, sys, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, "site")
FOLDERS = [{"id": "1zQl2U22LJVQyDoAHkceomlUnzu8G2zeQ", "name": "עברית", "key": "hebrew"}, {"id": "19MDS6dGCNCBrpGHRZUY8dFyJGsu9i52M", "name": "עברית לדוברי ערבית", "key": "hebrew-ar"}, {"id": "1YcolNnHPvFlcbf-GvDche9_zmu8ihZpR", "name": "כימיה", "key": "chemistry"}, {"id": "1OVMGK_me7tSQOSsqDaEuqq0fpyQAKNNa", "name": "גאוגרפיה", "key": "geography"}, {"id": "1-4zt4Ehme9QVGcfnjI_Qpkrndj3pjUWo", "name": "מדעי הסביבה", "key": "envsci"}, {"id": "11Ip-n5hfzPf2vfFN72-x2hv-X7TT_kZ2", "name": "ביולוגיה", "key": "biology"}, {"id": "1p3veGhaSnKQVI4aMv1gzw8z6npH1vHST", "name": "מוסיקה", "key": "music"}, {"id": "14DV7czwdI5HYxytlnE1d4rHngig5ljJb", "name": "תושב\"ע ומשפט ישראלי", "key": "torah-law"}, {"id": "1Hf0WW1ysiNLIJ6FW7Db6xe8DB_mXnDpA", "name": "כללי", "key": "general"}]
ROOT_ID = "1Y4Tq_vpKxon9Sgof1rPn18ztIyA_a8i7"

def ws(req):
    task = os.environ.get("TAB_TASK_ID")
    if not task:
        sys.exit(json.dumps({"ok": False, "error": "TAB_TASK_ID not set"}))
    d = f"/home/user/tab/tasks/{task}"
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, "itme-drive-list.json")
    json.dump(req, open(p, "w"), ensure_ascii=False)
    r = subprocess.run(["/usr/bin/node", "/home/user/tab/workspace-cli.mjs", "workspace.request", p],
                       capture_output=True, text=True, timeout=120)
    out = json.loads(r.stdout)
    body = out.get("result", {}).get("body")
    if not out.get("ok") or not isinstance(body, dict) or "error" in body:
        sys.exit(json.dumps({"ok": False, "error": str(out)[:800]}, ensure_ascii=False))
    return body

def main():
    q = " or ".join(f"'{f['id']}' in parents" for f in FOLDERS)
    files, token = [], None
    while True:
        query = {"q": f"({q}) and trashed=false", "pageSize": "1000",
                 "fields": "nextPageToken,files(id,name,mimeType,webViewLink,modifiedTime,parents)",
                 "quotaUser": "itme%d" % int(datetime.datetime.utcnow().timestamp())}  # varies so the CLI never serves a cached list
        if token: query["pageToken"] = token
        body = ws({"method": "GET", "url": "https://www.googleapis.com/drive/v3/files", "query": query})
        files += body.get("files", [])
        token = body.get("nextPageToken")
        if not token: break
    out = {"updated": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z", "source": "schedule", "folders": []}
    for f in FOLDERS:
        mine = [x for x in files if f["id"] in (x.get("parents") or []) and x.get("mimeType") != "application/vnd.google-apps.folder"]
        mine.sort(key=lambda x: x.get("modifiedTime", ""), reverse=True)
        out["folders"].append({"id": f["id"], "name": f["name"], "files": [
            {"id": x["id"], "name": x["name"], "url": x.get("webViewLink") or f"https://drive.google.com/file/d/{x['id']}/view",
             "mimeType": x.get("mimeType", ""), "modified": x.get("modifiedTime")} for x in mine]})
    path = os.path.join(SITE, "files.json")
    try:
        old = json.load(open(path))
    except Exception:
        old = {}
    changed = old.get("folders") != out["folders"]
    if changed or not old:
        json.dump(out, open(path, "w"), ensure_ascii=False, indent=1)
    n = sum(len(f["files"]) for f in out["folders"])
    res = {"ok": True, "files": n, "changed": changed, "published": False}
    if changed and "--publish" in sys.argv:
        r = subprocess.run(["node", "publish-cli.mjs", "site.publish", json.dumps({"slug": "itest-media-exams", "source_dir": SITE})],
                           cwd="/home/user/tab", capture_output=True, text=True, timeout=600)
        res["published"] = True
        res["publish_tail"] = (r.stdout or r.stderr)[-300:]
    print(json.dumps(res, ensure_ascii=False))

if __name__ == "__main__":
    main()
