import { Hono } from "hono";

// アップデート情報を配信するサンプルコード
// 最新バージョンは0.1.0と仮定
// URLクエリにバージョンを指定してアクセスすると、バージョンに応じて異なるJsonを返す

// もしバージョンが最新でなかった場合はGitHub上に配置されているJSONのURLを返す
// 最新の場合は`latest`という文字列を返す

// 返却するJSONの定義
interface API {
  version: string | null;
  updateURL: string | null;
  updatePageURL: string | null;
  releaseNotes: string | null;
  moreInfoURL: string | null;
  forced: boolean;
  dotnetVersion: null;
  dotnetDownloadLink: null;
  dotnetOfficialLink: null;
  versionTitle: string | null;
  major: boolean;
}

const app = new Hono();
const latest_version = "4.1.90"
const latest_display_version = "4.1 Nightly 24"

// バージョンの表記方法を定義
class Version {
  major: number;
  minor: number;
  patch: number;

  constructor(version: string) {
    const [major, minor, patch] = version.split(".");

    this.major = Number(major);
    this.minor = Number(minor);
    this.patch = Number(patch);
  }

  public toString(): string {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  isOlder(version: Version): boolean {
    // バージョン比較関数
    // 与えられたバージョより古い場合はtrueを返す
    if (this.major !== version.major) {
      return true;
    } else if (this.minor !== version.minor) {
      return true;
    } else if (this.patch !== version.patch) {
      return true;
    } else {
      return false;
    }
  }
}


app.get("/", (c) => {
  console.log(c.req.query("app_version"))
  if (c.req.query("app_version") === undefined) {
    return c.text("",400);
  }
  const version = new Version(String(c.req.query("app_version")));
  const latest = new Version(latest_version);
  if (version.isOlder(latest)) {
    const update_url = new URL(
      "https://github.com/creeper-0910/adg_update_srv/releases/latest/download/adguard.apk",
    );

    const content: API = {
      version: latest.toString(),
      updateURL: update_url.toString(),
      updatePageURL: "https://kb.adguard.com/general/adguard-beta-testing-program",
      releaseNotes: "これは、AdGuardのNightlyビルドの更新です。このアップデートチャネルは不安定であることをご了承ください。\r\n\r\n## バージョン "+latest_display_version.toString()+"\r\n\r\n* [Fixed] JP Hack!",
      moreInfoURL: "* [Fixed] JP Hack!",
      forced: false,
      dotnetVersion: null,
      dotnetDownloadLink: null,
      dotnetOfficialLink: null,
      versionTitle: latest_display_version.toString(),
      major: false,
    };

    return c.json(content);
  } else {
    const content: API = {
      version: null,
      updateURL: null,
      updatePageURL: null,
      releaseNotes: null,
      moreInfoURL: null,
      forced: false,
      dotnetVersion: null,
      dotnetDownloadLink: null,
      dotnetOfficialLink: null,
      versionTitle: null,
      major: false,
    };

    return c.json(content);
  }
});

export default app
