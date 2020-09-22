
export class ColorHelper {

    public static usingDarkTheme(): boolean {
        return window.getComputedStyle(document.body).getPropertyValue("background-color") == "rgb(34, 34, 34)";
    }

}
(window as any).ColorHelper = ColorHelper;