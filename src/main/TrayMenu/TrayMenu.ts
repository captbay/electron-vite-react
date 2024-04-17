import { app, BrowserWindow, Menu, nativeImage, NativeImage, Tray } from 'electron'
import { interval } from 'rxjs'

export class TrayMenu {
  // Create a variable to store our tray
  // Public: Make it accessible outside of the class;
  // Readonly: Value can't be changed
  public readonly tray: Tray

  // Path where should we fetch our icon;
  private iconPath: string = '/resources/icon.png'

  constructor(win: BrowserWindow) {
    this.tray = new Tray(this.createNativeImage(this.iconPath))
    // set tooltip
    this.tray.setToolTip('Explore Electron')
    // We need to set the context menu to our tray
    this.tray.setContextMenu(this.createMenu(win))
    this.tray.on('click', () => {
      win.focus()
      this.tray.setContextMenu(this.createMenu(win))
    })
  }

  createNativeImage(iconPath: string): string | NativeImage {
    // Since we never know where the app is installed,
    // we need to add the app base path to it.
    const path = `${app.getAppPath()}${iconPath}`
    const image = nativeImage.createFromPath(path)
    // Marks the image as a template image.
    image.setTemplateImage(true)
    return image
  }

  createMenu(win: BrowserWindow): Menu {
    let currentDate: Date = new Date()

    interval(1000).subscribe({
      next: () => {
        currentDate = new Date()

        contextMenu.items[1].label = currentDate.toLocaleString()
        const newContextMenu = Menu.buildFromTemplate(contextMenu.items)
        this.tray.setContextMenu(newContextMenu)

        console.log(currentDate.toLocaleString())
      }
    })

    let isHidden = false
    // This method will create the Menu for the tray
    const contextMenu = Menu.buildFromTemplate([
      {
        icon: this.createNativeImage('/resources/eye.png'),
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

          // const observer = {
          //   next: (x) => console.log('Observer got a next value: ' + x),
          //   error: (err) => console.error('Observer got an error: ' + err),
          //   complete: () => console.log('Observer got a complete notification')
          // }

          // observable.subscribe(observer)

          isHidden = !isHidden
          const newContextMenu = Menu.buildFromTemplate(contextMenu.items)
          this.tray.setContextMenu(newContextMenu)
        }
      },
      // tray menu to show date and time in real time
      {
        label: 'tesT' + currentDate.toLocaleString(),
        type: 'normal'
      },
      {
        label: '',
        type: 'separator'
      },
      {
        icon: this.createNativeImage('/resources/arrow-left-start-on-rectangle.png'),
        label: 'Quit',
        type: 'normal',
        click: () => app.quit()
      }
    ])

    return contextMenu
  }
}
