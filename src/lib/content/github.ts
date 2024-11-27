import * as fs from "fs";
import * as path from "path";
import AdmZip from "adm-zip";

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  body: string;
  assets: {
    name: string;
    browser_download_url: string;
  }[];
}

const DOWNLOAD_TRACKING_FILE = path.join(
  process.cwd(),
  "content",
  "last_download.json"
);
const DOWNLOAD_DIR = path.join(process.cwd(), "public", "repo-content");
const EXAMPLES_DIR = path.join(DOWNLOAD_DIR, "./");

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getLastDownloadedVersion(): number | null {
  try {
    ensureDirectoryExists(DOWNLOAD_DIR);
    if (fs.existsSync(DOWNLOAD_TRACKING_FILE)) {
      const data: GitHubRelease = JSON.parse(
        fs.readFileSync(DOWNLOAD_TRACKING_FILE, "utf-8")
      );
      return data.id;
    }
  } catch (error) {
    console.error("Error reading download tracking file:", error);
  }
  return null;
}

function saveDownloadedVersion({ body, ...rest }: GitHubRelease) {
  try {
    fs.writeFileSync(
      DOWNLOAD_TRACKING_FILE,
      JSON.stringify({ ...rest, changelog: body })
    );
  } catch (error) {
    console.error("Error saving download tracking file:", error);
  }
}

export async function downloadGitHubRelease(): Promise<boolean> {
  try {
    // Ensure downloads directory exists
    ensureDirectoryExists(DOWNLOAD_DIR);
    const lastDownloadedVersion = getLastDownloadedVersion();
    const folderNotEmpty = fs.readdirSync(EXAMPLES_DIR).length > 0;
    // Check if examples already exist
    if (
      fs.existsSync(EXAMPLES_DIR) &&
      folderNotEmpty &&
      lastDownloadedVersion
    ) {
      console.log("Examples already downloaded");
      return false;
    }

    // Fetch the latest release information
    const releaseUrl = `https://api.github.com/repos/sevenreup/duwa/releases/latest`;
    const releaseResponse = await fetch(releaseUrl, {
      headers: {
        "User-Agent": "Duwa-Example-Downloader",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!releaseResponse.ok) {
      throw new Error(
        `Failed to fetch release info: ${releaseResponse.statusText}`
      );
    }

    const release: GitHubRelease = await releaseResponse.json();

    // Check if this is a new release
    if (lastDownloadedVersion === release.id && folderNotEmpty) {
      console.log("No new release to download");
      return false;
    }

    // Find the examples.zip asset
    const examplesAsset = release.assets.find(
      (asset) => asset.name === "examples.zip"
    );

    if (!examplesAsset) {
      throw new Error("Could not find examples.zip in the release assets");
    }

    // Download the file
    const downloadPath = path.join(DOWNLOAD_DIR, "examples.zip");
    const downloadResponse = await fetch(examplesAsset.browser_download_url);

    if (!downloadResponse.ok) {
      throw new Error(
        `Failed to download file: ${downloadResponse.statusText}`
      );
    }

    const fileBuffer = await downloadResponse.arrayBuffer();
    fs.writeFileSync(downloadPath, Buffer.from(fileBuffer));

    // Extract the zip file
    const zip = new AdmZip(downloadPath);
    zip.extractAllTo(EXAMPLES_DIR, true);

    // Delete the zip file after extraction
    fs.unlinkSync(downloadPath);

    // Save the downloaded release ID
    saveDownloadedVersion(release);

    console.log("Duwa examples downloaded and extracted successfully");
    return true;
  } catch (error) {
    console.error("Error downloading Duwa examples:", error);
    return false;
  }
}
