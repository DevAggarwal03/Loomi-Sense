# Version 3 Implementation Plan: Scan from Canvas

## Overview
Add a "Scan from Canvas" feature that captures the current canvas as PNG, analyzes it with Gemini, and auto-fills the search box (which remains editable).

## Flow
```
User clicks "Scan from Canvas" 
  → Export canvas as PNG blob 
  → Convert blob to base64 
  → Send to Gemini via performOCR 
  → Auto-fill search box 
  → User can edit search query 
  → User clicks Search button
```

## Implementation Steps

### 1. UI Changes (App.js)
- [x] Add new state: `_isProcessingScan` (similar to `_isProcessingUpload`)
- [x] Add "Scan from Canvas" button next to "Upload from Device" button
- [x] Update button layout to accommodate both buttons (side-by-side or stacked)
- [x] Add visual hint in search input when auto-filled (subtle border color or icon)

### 2. Export Function
- [x] Create `_exportCanvasAsPNG()` method:
  - Uses `this.addOnUISdk.app.document.createRenditions()`
  - Parameters: `{ range: "currentPage", format: "image/png" }`
  - Returns PNG blob from `renditions[0].blob`
  - Error handling with try-catch

### 3. Blob to Base64 Conversion
- [x] Create `_blobToBase64(blob)` helper method:
  - Uses FileReader API
  - Returns Promise that resolves to base64 string
  - Reuses pattern from `_readFileAsBase64()`

### 4. Scan Handler
- [x] Create `_handleScanFromCanvas()` method:
  - Sets `_isProcessingScan = true`
  - Calls `_exportCanvasAsPNG()`
  - Converts blob to base64
  - Calls `performOCR(base64Image, "image/png")`
  - Auto-fills `_searchQuery` with result
  - Clears errors
  - Sets `_isProcessingScan = false`
  - Error handling with user-friendly messages

### 5. Visual Enhancements
- [x] Add CSS class for editable hint (e.g., `.search-input.auto-filled`)
- [x] Update search input placeholder or add subtle border when auto-filled
- [x] Ensure search input remains clearly editable

### 6. Button States
- [x] Disable "Scan from Canvas" button when:
  - `_isProcessingScan` is true
  - `_isLoading` is true
  - `_isProcessingUpload` is true
  - SDK is not ready

### 7. Error Handling
- [x] Handle SDK not ready errors
- [x] Handle export failures
- [x] Handle Gemini API errors (reuse existing error handling)
- [x] Show user-friendly error messages

## Technical Details

### Export Function Signature
```javascript
async _exportCanvasAsPNG() {
  const renditions = await this.addOnUISdk.app.document.createRenditions({
    range: "currentPage",
    format: "image/png",
  });
  return renditions[0].blob;
}
```

### Integration Points
- Reuse existing `performOCR()` from `geminiService.js`
- Reuse existing search flow after auto-fill
- Follow same pattern as `_handleFileUpload()` for consistency

## Testing Checklist
- [ ] Scan button appears and is clickable
- [ ] Canvas export works correctly
- [ ] Base64 conversion works
- [ ] Gemini analysis returns search query
- [ ] Search box auto-fills correctly
- [ ] Search box is editable after auto-fill
- [ ] Visual hint appears when auto-filled
- [ ] Error handling works for all failure cases
- [ ] Button states are correct (disabled when appropriate)
- [ ] Loading states display correctly

## Files to Modify
1. `v2/src/ui/components/App.js` - Main implementation
2. `v2/src/ui/components/App.css.js` - Visual hints styling

## Files to Reference
- `EXPORT_CONTEXT.md` - Export function documentation
- `v2/src/ui/services/geminiService.js` - OCR service (no changes needed)
