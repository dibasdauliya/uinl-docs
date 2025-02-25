# UINL Protocol Documentation

## Sample Interaction

### UI->APP: Initial Handshake

- **Content:** `{"t":0}`
- **Description:** User-agent announces that it has loaded, and requests the initial display; `t:0` indicates that UI clock time is at 0ms

### APP->UI: Add Content

- **Content:** `{"value":["Hello World!"],{"class":"btn","id":"click me"}}`
- **Shorthand:** `{"v":["Hello World!"],{"c":"btn","id":"click me"}}`
- **Description:** Text "Hello World!" and button "click me" are added to user display

### UI->APP: Button Click

- **Content:** `{"t":3450,"u":"click me","v":true}`
- **Description:** User clicks the button "click me" (3.45s after the UI loaded)

### APP->UI: Close Application

- **Content:** `{"value":["Goodbye."],"!state":0}`
- **Description:** Display is cleared, text "Goodbye." is added to the display; "!state":0 indicates that app is closing

## Protocol Specification

### Message Types

#### 1. UI->APP Handshake

- **Grammar:** `{(<<[uiInfo](#ui-info)>>)*"t":0,(<<[uiInfo](#ui-info)>>)*}`
- **Description:** First message sent from user-agent to app software once user-agent software is loaded and ready. No other UI->APP or APP->UI messages should precede this message.
- **Note:** Detailed `<<[uiInfo](#ui-info)>>` is voluntary but highly encouraged (especially "userAgent" and "time")

#### 2. UI->APP Action

- **Grammar:** `{<<[userProp](#user-properties)>>,(<<[userProp](#user-properties)>>)*}`
- **Description:** User-side action/event (e.g., button-click, textbox edit)

#### 3. APP->UI Response

- **Grammar:** `{(<<uiDirective>>,(<<uiDirective>>)*)?}`
- **Description:** App-driven updates to user display
- **Note:** By default UINL protocol is synchronous, requiring an APP->UI message in response to every UI->APP message
- **Empty Response:** When there are no `<<uiDirective>>`'s (i.e., APP->UI message is `{}`) that signifies there are no display updates

### UI Info {#ui-info}

#### userAgent

- **Grammar:** `"userAgent":<<text>>`
- **Description:** Information about UI software (i.e., user-agent name, version)

#### Window Dimensions

- **Grammar:** `"wh":[<<number>>,<<number>>]`
- **Description:** Available width/height of application window (in pixels)

#### IP Address

- **Grammar:** `"ip":<<text>>`
- **Description:** User-agent ip address

#### URL

- **Grammar:** `"url":<<text>>`
- **Description:** URL (if any) employed by UI to connect to the app

#### Time

- **Grammar:** `"time":<<text>>`
- **Description:** Full user local time, including milliseconds and timezone offset, in ISO8601 format
- **Example:** `"2025-02-22T11:26:43.967-04:00"`

#### Platform

- **Grammar:** `"platform":<<text>>`
- **Description:** Information about where UI software is running (i.e., OS, framework)

#### System

- **Grammar:** `"system":<<settings>>`
- **Description:** Any user-system information available (e.g., memory available, type of GPU, type of CPU)

#### Screen

- **Grammar:** `"screen":<<settings>>`
- **Description:** User screen information
- **Example:**
  ```json
  {
    "availWidth": 1168,
    "availHeight": 692,
    "width": 1229,
    "height": 692,
    "colorDepth": 24,
    "pixelDepth": 24,
    "availLeft": 0,
    "availTop": 0,
    "orientation": {
      "angle": 0,
      "type": "landscape-primary"
    }
  }
  ```
