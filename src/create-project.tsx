import { confirmAlert, getPreferenceValues, LaunchProps, open, showHUD, showToast, Toast } from "@raycast/api";
import { createEmptyProject } from "./libs/createEmptyProject";
import { getProjectPath } from "./libs/getProjectPath";

const { editor } = getPreferenceValues<Preferences>()

export default async function Command(props: LaunchProps<{ arguments: Arguments.CreateProject }>) {
  if (!editor) {
    return showToast({
      title: "⚠️ Please configure the extension to choose an **Editor** app to use.",
      style: Toast.Style.Failure
    })
  }

  const name = props.arguments.name
  if (await createEmptyProject(name) && await confirmAlert({
    title: `Do you want to open "${name}" in the default editor ${editor.name}?`,
    message: 'Project is created!',
    icon: { fileIcon: editor.path },
    primaryAction: {
      title: 'Open',
    }
  })) {
    await open(getProjectPath(name), editor)
    showHUD(`Project ${name} is opened in ${editor.name}`)
  }
}
