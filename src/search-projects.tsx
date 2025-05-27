import { ActionPanel, Action, Icon, List, getPreferenceValues, Detail } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { listProjects } from "./libs/listProjects";
import { ROOT_DIR, VSCODE_WORKSPACE_SUFFIX } from "./libs/constants";
import { join } from "node:path";
import { toHomeRelativePath } from "./libs/toHomeRelativePath";
import { ensureDir } from "./libs/ensureDir";

type ProjectType = 'workspace' | 'folder'

const { editor } = getPreferenceValues<Preferences>()

export default function Command() {
  if (!editor) {
    return (
      <Detail markdown={ "⚠️ Please configure the extension to choose an **Editor** app to use." } />
    )
  }

  if (!ensureDir(ROOT_DIR)) {
    return (
      <Detail markdown={ `❌ Failed to create ${ROOT_DIR}` } />
    )
  }

  const { isLoading, data: items = [] } = usePromise(async () => {
    const names = await listProjects()
    return names.map((name) => {
      const type: ProjectType = name.endsWith(VSCODE_WORKSPACE_SUFFIX) ? 'workspace' : 'folder'
      const path = join(ROOT_DIR, name)
      return {
        id: name,
        type,
        icon: type === 'workspace' ? Icon.AppWindowGrid2x2 : Icon.Folder,
        title: name,
        path,
        subtitle: toHomeRelativePath(path),
        // accessory: "Accessory",
      }
    })
  })

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search for local projects...">
      {items.map((item) => (
        <List.Item
          key={item.id}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          // accessories={[{ icon: Icon.Text, text: item.accessory }]}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.Open title={ 'Open ' + (item.type === 'workspace' ? 'Workspace' : 'Project') + ' in ' + editor.name } icon={{ fileIcon: editor.path}} application={editor} target={item.path} />
                <Action.ShowInFinder path={item.path} />
                <Action.OpenWith path={item.path} shortcut={{ modifiers: ["cmd"], key: "o" }} />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action.CopyToClipboard title="Copy Name" content={item.title} shortcut={{ modifiers: ["cmd"], key: "." }} />
                <Action.CopyToClipboard title="Copy Path" content={item.path} shortcut={{ modifiers: ["cmd", "shift"], key: "." }} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
