// import { readdir } from 'fs-extra'
import { readdir } from "fs/promises";
import { ROOT_DIR, VSCODE_WORKSPACE_SUFFIX } from "./constants";
import { isValidProjectName } from "./isValidProjectName";
import { showFailureToast } from "@raycast/utils";

export async function listProjects() {
  try {
    const list = await readdir(ROOT_DIR, { withFileTypes: true });
    const names = list
      .filter((v) => {
        if (v.isDirectory() && isValidProjectName(v.name).valid) return true;
        if (
          v.isFile() &&
          v.name.endsWith(VSCODE_WORKSPACE_SUFFIX) &&
          isValidProjectName(v.name.replace(VSCODE_WORKSPACE_SUFFIX, "")).valid
        )
          return true;
        return false;
      })
      .map((v) => v.name);
    return names;
  } catch (error) {
    showFailureToast(error, { title: "Could not read directory" });
    return [];
  }
}
