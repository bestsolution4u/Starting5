# Starting Five App

### Current State
* Using the React Native Elements component styles (https://react-native-elements.github.io/react-native-elements/docs/getting_started.html).
* Symbols / Icons use ***font-awesome***.
* Project used NotoSans, and Monument font sets.

### Classes / Modules
* styles/ - This folder contains the **appStyles.js** stylesheet for the whole app, as well as individual **xStyle.js** files for each screen.
* App.js - Manages navigation, loads the initial page
* controllers/ - Folder containing abstraction layers for the local and remote databases, and probably other things in the future.
* screens/ - Folder containing each screen or fragment "component" which can be imported as a component within a view, or used as an isolated view. The convention is that **...Screen.js** files are intended to be a whole screen view, and **...Fragment.js** files are intended to be displayed within another view.
* Each ***screen*** should include the `<MyHeader />` at the top of the to handle navigation.

### Problems
 * Music player controlls don't appear on iOS lock screen with simulator. Confirm that they work on real phone.

### TODO:
* Billing and subscription management

### Naming and Class Conventions
* Whole page screens should use a class
* Individual components within the screen should use functions
* Asset files should be named lower case with hyphenated words
* Class titles MUST be capitalised
* Function and variable names should be cammel case
* JS file names should be cammel case
* Where a file contains only a single class or function use ***export default***, otherwise just ***export***