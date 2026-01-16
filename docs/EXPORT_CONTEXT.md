# Export PNG - Simple Guide

## Overview

This guide shows how to export the current page of an Adobe Express document as a PNG image and pass it to your function.

---

## SDK Function: `createRenditions()`

**Purpose**: Exports the document as a PNG image.

**Function**: `AddOnSdk.app.document.createRenditions(options)`

**Parameters**:

- `range` (string): `"currentPage"` or `"entireDocument"`
- `format` (string): `"image/png"` for PNG export
- `backgroundColor` (number, optional): Background color as decimal (ARGB format)
  - Example: `4294967295` = white with alpha

**Returns**: Array with one object containing:

- `blob`: The PNG image as a Blob

---

## Quick Start

### Step 1: Import SDK

```javascript
import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
await AddOnSdk.ready;
```

### Step 2: Export PNG Function

```javascript
async function exportAsPNG() {
  try {
    const renditions = await AddOnSdk.app.document.createRenditions({
      range: "currentPage", // or "entireDocument"
      format: "image/png",
    });

    // renditions is an array, get the first (and only) item
    const pngBlob = renditions[0].blob;

    // Pass to your function
    yourFunction(pngBlob);

    return pngBlob;
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
}
```

### Step 3: Your Function

```javascript
function yourFunction(pngBlob) {
  // Do something with the PNG blob
  // Examples:

  // Convert to base64
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result;
    console.log("Base64:", base64);
  };
  reader.readAsDataURL(pngBlob);

  // Create image URL for display
  const imageUrl = URL.createObjectURL(pngBlob);
  console.log("Image URL:", imageUrl);

  // Send to server
  // fetch('/api/upload', {
  //   method: 'POST',
  //   body: pngBlob
  // });
}
```

---

## Complete Example

```javascript
// Initialize SDK
import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

async function init() {
  await AddOnSdk.ready;

  // Export and process
  const pngBlob = await exportAsPNG();
  processPNG(pngBlob);
}

async function exportAsPNG() {
  const renditions = await AddOnSdk.app.document.createRenditions({
    range: "currentPage",
    format: "image/png",
  });
  return renditions[0].blob;
}

function processPNG(blob) {
  // Your custom logic here
  console.log("PNG blob size:", blob.size);
  console.log("PNG blob type:", blob.type);

  // Example: Convert to base64
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64Image = reader.result;
    sendToAPI(base64Image);
  };
  reader.readAsDataURL(blob);
}

function sendToAPI(base64Image) {
  // Send to your API
  fetch("/your-api-endpoint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });
}
```

---

## With Background Color (Optional)

If you need a background color:

```javascript
async function exportAsPNG(backgroundColor) {
  const params = {
    range: "currentPage",
    format: "image/png",
  };

  if (backgroundColor) {
    params.backgroundColor = backgroundColor; // ARGB decimal format
  }

  const renditions = await AddOnSdk.app.document.createRenditions(params);
  return renditions[0].blob;
}

// Usage
const whiteBackground = 4294967295; // White with alpha
const pngBlob = await exportAsPNG(whiteBackground);
```

**Background Color Format**:

- Must be decimal (not hex)
- ARGB format: `(A * 256³) + (R * 256²) + (G * 256) + B`
- Example: White = `(255 * 256³) + (255 * 256²) + (255 * 256) + 255 = 4294967295`

---

## Common Use Cases

### Export and Convert to Base64

```javascript
async function exportToBase64() {
  const renditions = await AddOnSdk.app.document.createRenditions({
    range: "currentPage",
    format: "image/png",
  });

  const blob = renditions[0].blob;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// Usage
const base64 = await exportToBase64();
console.log(base64); // "data:image/png;base64,..."
```

### Export and Send to Server

```javascript
async function exportAndUpload() {
  const renditions = await AddOnSdk.app.document.createRenditions({
    range: "currentPage",
    format: "image/png",
  });

  const blob = renditions[0].blob;

  // Send to server
  const formData = new FormData();
  formData.append("image", blob, "export.png");

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  return response.json();
}
```

### Export and Create Image Element

```javascript
async function exportAndDisplay() {
  const renditions = await AddOnSdk.app.document.createRenditions({
    range: "currentPage",
    format: "image/png",
  });

  const blob = renditions[0].blob;
  const imageUrl = URL.createObjectURL(blob);

  // Create and display image
  const img = document.createElement("img");
  img.src = imageUrl;
  document.body.appendChild(img);

  // Clean up URL when done
  // URL.revokeObjectURL(imageUrl);
}
```

---

## Important Notes

1. **Always use try-catch**: SDK calls can fail, wrap them in try-catch blocks.

2. **Blob cleanup**: If you create object URLs, revoke them when done:

   ```javascript
   URL.revokeObjectURL(imageUrl);
   ```

3. **Single page export**: `createRenditions()` with `"currentPage"` returns an array with one item. Use `renditions[0].blob` to get the PNG.

4. **Multiple pages**: If you use `"entireDocument"`, you'll get multiple renditions (one per page). Handle accordingly:

   ```javascript
   const renditions = await AddOnSdk.app.document.createRenditions({
     range: "entireDocument",
     format: "image/png",
   });

   renditions.forEach((rendition, index) => {
     processPNG(rendition.blob, index);
   });
   ```

5. **No dependencies needed**: For basic PNG export, you don't need JSZip or FileSaver - just the SDK.

---

## Minimal Integration

If you only need to export PNG and pass to a function, here's the minimal code:

```javascript
// 1. Import SDK (in your HTML or JS file)
import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

// 2. Wait for SDK to be ready
await AddOnSdk.ready;

// 3. Export function
async function getPNG() {
  const renditions = await AddOnSdk.app.document.createRenditions({
    range: "currentPage",
    format: "image/png",
  });
  return renditions[0].blob;
}

// 4. Use it
const pngBlob = await getPNG();
yourFunction(pngBlob);
```

That's it! No other dependencies or complex setup needed.
