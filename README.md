# electron-form-dialog

Electron helper to prompt for input given any html form inputs.

## Usage

```sh
npm install electron-form-dialog --save
```

```js
dialog([contentOptions, windowOptions]).then(...).catch(...)
```
The result object given to the `then` function is a JSON object that maps `name` to 
1. `value` of checked radio button incase of radio input, or null if none is selected
2. `true` if checked for checkboxes
3. `value` for any other input and select

## Example

```js
const dialog = require('electron-form-dialog');

dialog({
	title: 'Server selection',
	label: 'Please select a server',
	form: `
		<input type="radio" name="server" value="default" checked>
		<label for="default">Standard server</label>
		<br>
		<input type="radio" name="server" value="custom">
		<input type="url" name="custominput" for="custom" placeholder="http://test.com">`
}).then((r) => {
    if(r != null) {
        if(r.server === "custom") {
                setServer(r.custominput);
        } else {
            setServer(null);
        }
    }
}).catch(console.error);
```

### ContentOptions object (required)

| Key  | Explanation |
| ------------- | ------------- |
| form | (required, string) Custom HTML to add to the form container. Upon submitting all input tags in this container will converted to JSON object that maps name attribues to values. |
| description  | (optional, string) The label which appears above the form. Defaults to 'Please fill this form'. |
| buttonLabels | (optional, object) The text for the OK/cancel buttons. Properties are 'ok' and 'cancel'. Defaults to null. |
| labelIsHtml | (optional, boolean) Whether the label should be interpreted as HTML or not. Defaults to false. |
| customStylesheet  | (optional, string) The local path of a CSS file to stylize the prompt window. Defaults to null. |

### WindowOptions object (optional)

| Key  | Explanation |
| ------------- | ------------- |
| title  | (optional, string) The title of the prompt window. Defaults to 'Dialog'. |
| width  | (optional, integer) The width of the prompt window. Defaults to 370. |
| minWidth  | (optional, integer) The minimum allowed width for the prompt window. Same default value as width. |
| height  | (optional, integer) The height of the prompt window. Defaults to 130. |
| minHeight  | (optional, integer) The minimum allowed height for the prompt window. Same default value as height. |
| resizable  | (optional, boolean) Whether the prompt window can be resized or not (also sets useContentSize). Defaults to false. |
| alwaysOnTop | (optional, boolean) Whether the window should always stay on top of other windows. Defaults to false |
| icon | (optional, string) The path to an icon image to use in the title bar. Defaults to null and uses electron's icon. |
| menuBarVisible | (optional, boolean) Whether to show the menubar or not. Defaults to false. |
| skipTaskbar | (optional, boolean) Whether to show the prompt window icon in taskbar. Defaults to true. |
| parentWindow | (optional, object) The window in which to display the prompt on. Defaults to null |