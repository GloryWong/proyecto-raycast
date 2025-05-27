import { confirmAlert, showToast, Toast } from "@raycast/api"
import { isValidProjectName } from "./isValidProjectName"
import { projectExists } from "./projectExists"
import { ensureDir } from "./ensureDir"
import { initGit } from "./initGit"
import { getProjectPath } from "./getProjectPath"

export async function createEmptyProject(name: string) {
  const result = isValidProjectName(name)
  if (!result.valid) {
    await showToast({
      title: `Invalid project name "${name}"`,
      message: result.error,
      style: Toast.Style.Failure
    })
    return false
  }

  const existent = await projectExists(name)
  if (existent) {
    await showToast({
      title: `Project "${name}" already exists`,
      style: Toast.Style.Failure
    })
    return false
  }

  const dir = getProjectPath(name)

  if (!(await confirmAlert({
    title: `Are you sure to create project "${name}"?`,
    rememberUserChoice: true
  }))) {
    return false
  }

  if (!ensureDir(dir))
    return false

  return initGit(dir)
}
