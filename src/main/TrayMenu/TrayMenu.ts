import { app, Tray, nativeImage, Menu, BrowserWindow, NativeImage } from 'electron'

export class TrayMenu {
  // Create a variable to store our tray
  // Public: Make it accessible outside of the class;
  // Readonly: Value can't be changed
  public readonly tray: Tray

  // Path where should we fetch our icon;
  private iconPath: string = '/resources/icon.png'

  constructor(win: BrowserWindow) {
    this.tray = new Tray(this.createNativeImage())
    // We need to set the context menu to our tray
    this.tray.setContextMenu(this.createMenu(win))
  }

  createNativeImage(): string | NativeImage {
    // Since we never know where the app is installed,
    // we need to add the app base path to it.
    const path = `${app.getAppPath()}${this.iconPath}`
    const image = nativeImage.createFromPath(path)
    // Marks the image as a template image.
    image.setTemplateImage(true)
    return image
  }

  createMenu(win: BrowserWindow): Menu {
    let isHidden = false
    // This method will create the Menu for the tray
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Hide',
        type: 'normal',
        click: (): void => {
          if (isHidden) {
            win.show()
            win.focus()
            contextMenu.items[0].label = 'Hide'
          } else {
            win.hide()
            contextMenu.items[0].label = 'Show'
          }

          isHidden = !isHidden

          const newContextMenu = Menu.buildFromTemplate(contextMenu.items)
          this.tray.setContextMenu(newContextMenu)
        }
      },
      {
        label: 'Quit',
        type: 'normal',
        click: () => app.quit()
      }
    ])
    return contextMenu
  }
}
