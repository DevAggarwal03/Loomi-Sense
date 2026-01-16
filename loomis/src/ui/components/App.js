// To support: system="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/theme/theme-light.js";

// To learn more about using "spectrum web components" visit:
// https://opensource.adobe.com/spectrum-web-components/
import "@spectrum-web-components/button/sp-button.js";
// Note: textfield component needs to be installed via: npm install @spectrum-web-components/textfield@1.7.0
// Temporarily using native input until package is installed
// import "@spectrum-web-components/textfield/sp-textfield.js";
import "@spectrum-web-components/theme/sp-theme.js";

import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { style } from "./App.css";

import { RuntimeType } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import {
  searchGifs,
  getGifUrl,
  getPreviewUrl,
  cleanQuery,
} from "../services/tenorApi.js";
import { performOCR } from "../services/geminiService.js";

@customElement("add-on-app")
export class App extends LitElement {
  @property({ type: Object })
  addOnUISdk;

  @state()
  _sandboxProxy;

  @state()
  _searchQuery = "";

  @state()
  _searchResults = [];

  @state()
  _isLoading = false;

  @state()
  _errorMessage = "";

  @state()
  _insertingGifId = null;

  @state()
  _isProcessingUpload = false;

  @state()
  _isProcessingScan = false;

  @state()
  _isAutoFilled = false;

  static get styles() {
    return style;
  }

  async firstUpdated() {
    // Get the UI runtime.
    const { runtime } = this.addOnUISdk.instance;

    // Get the proxy object, which is required
    // to call the APIs defined in the Document Sandbox runtime
    // i.e., in the `code.ts` file of this add-on.
    this._sandboxProxy = await runtime.apiProxy(RuntimeType.documentSandbox);
  }

  _handleSearchInput(e) {
    this._searchQuery = e.target.value;
    this._errorMessage = "";
    // Clear auto-filled flag when user starts typing
    if (this._isAutoFilled) {
      this._isAutoFilled = false;
    }
  }

  _handleSearchKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this._handleSearch();
    }
  }

  async _handleSearch() {
    const query = cleanQuery(this._searchQuery);

    if (!query) {
      this._errorMessage = "Please enter a search term";
      return;
    }

    this._isLoading = true;
    this._errorMessage = "";
    this._searchResults = [];

    try {
      const response = await searchGifs(query, 20);
      this._searchResults = response.results || [];

      if (this._searchResults.length === 0) {
        this._errorMessage = "No GIFs found. Try a different search term.";
      }
    } catch (error) {
      console.error("Search error:", error);
      this._errorMessage =
        error.message || "Failed to search GIFs. Please try again.";
      this._searchResults = [];
    } finally {
      this._isLoading = false;
    }
  }

  _handleUploadButtonClick() {
    const fileInput = this.shadowRoot.querySelector("#file-input");
    if (fileInput) {
      fileInput.click();
    }
  }

  async _handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      this._errorMessage =
        "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.";
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      this._errorMessage =
        "File size too large. Please upload an image under 10MB.";
      return;
    }

    this._isProcessingUpload = true;
    this._errorMessage = "";

    try {
      // Read file as base64
      const base64Image = await this._readFileAsBase64(file);

      // Call Gemini API
      const query = await performOCR(base64Image, file.type);

      // Auto-fill search query (user can edit before searching)
      this._searchQuery = query.trim();
      this._isAutoFilled = true;

      // Clear any previous error messages
      this._errorMessage = "";
    } catch (error) {
      console.error("Upload error:", error);
      this._errorMessage =
        error.message ||
        "Failed to process image. You can still search manually.";
    } finally {
      this._isProcessingUpload = false;
      // Reset file input so the same file can be selected again
      e.target.value = "";
    }
  }

  _readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Export the current canvas as PNG blob using Adobe Express SDK
   */
  async _exportCanvasAsPNG() {
    if (
      !this.addOnUISdk ||
      !this.addOnUISdk.app ||
      !this.addOnUISdk.app.document
    ) {
      throw new Error("Add-on SDK not ready. Please try again.");
    }

    try {
      const renditions = await this.addOnUISdk.app.document.createRenditions({
        range: "currentPage",
        format: "image/png",
      });

      if (!renditions || renditions.length === 0 || !renditions[0].blob) {
        throw new Error("Failed to export canvas. No rendition received.");
      }

      return renditions[0].blob;
    } catch (error) {
      console.error("Canvas export error:", error);
      throw new Error(
        error.message || "Failed to export canvas. Please try again."
      );
    }
  }

  /**
   * Convert a blob to base64 data URL
   */
  _blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error("Failed to convert blob to base64"));
      };
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Handle scan from canvas: export canvas, analyze with Gemini, auto-fill search
   */
  async _handleScanFromCanvas() {
    this._isProcessingScan = true;
    this._errorMessage = "";

    try {
      // Export canvas as PNG blob
      const pngBlob = await this._exportCanvasAsPNG();

      // Convert blob to base64
      const base64Image = await this._blobToBase64(pngBlob);

      // Call Gemini API to analyze the image
      const query = await performOCR(base64Image, "image/png");

      // Auto-fill search query (user can edit before searching)
      this._searchQuery = query.trim();
      this._isAutoFilled = true;

      // Clear any previous error messages
      this._errorMessage = "";
    } catch (error) {
      console.error("Scan from canvas error:", error);
      this._errorMessage =
        error.message ||
        "Failed to scan canvas. You can still search manually.";
    } finally {
      this._isProcessingScan = false;
    }
  }

  async _handleInsertGif(gifResult) {
    const gifUrl = getGifUrl(gifResult);

    if (!gifUrl) {
      this._errorMessage = "Failed to get GIF URL";
      return;
    }

    if (
      !this.addOnUISdk ||
      !this.addOnUISdk.app ||
      !this.addOnUISdk.app.document
    ) {
      this._errorMessage = "Add-on SDK not ready. Please try again.";
      return;
    }

    this._insertingGifId = gifResult.id;
    this._errorMessage = "";

    try {
      // Fetch the GIF as a blob
      const response = await fetch(gifUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch GIF: ${response.status}`);
      }

      const gifBlob = await response.blob();

      // Insert the animated GIF into the document
      await this.addOnUISdk.app.document.addAnimatedImage(
        gifBlob,
        {
          title: gifResult.title || "Meme GIF",
          author: "Tenor",
        },
        {
          nodeAddOnData: {
            gifId: gifResult.id,
            source: "tenor",
          },
          mediaAddOnData: {
            searchQuery: this._searchQuery,
            tenorId: gifResult.id,
          },
        }
      );
    } catch (error) {
      console.error("Insert error:", error);
      this._errorMessage =
        error.message || "Failed to insert GIF. Please try again.";
    } finally {
      this._insertingGifId = null;
    }
  }

  render() {
    // Please note that the below "<sp-theme>" component does not react to theme changes in Express.
    // You may use "this.addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
    return html`
      <sp-theme system="express" color="light" scale="medium">
        <div class="container">
          <div class="search-section">
            <h2 class="title">Meme & GIF Finder</h2>
            <div class="upload-controls">
              <input
                type="file"
                id="file-input"
                accept="image/*"
                style="display: none;"
                @change=${this._handleFileUpload}
              />
              <sp-button
                size="m"
                variant="secondary"
                @click=${this._handleUploadButtonClick}
                ?disabled=${this._isProcessingUpload ||
                this._isProcessingScan ||
                this._isLoading}
                class="upload-button"
              >
                ${this._isProcessingUpload
                  ? "Processing..."
                  : "Upload from Device"}
              </sp-button>
              <sp-button
                size="m"
                variant="secondary"
                @click=${this._handleScanFromCanvas}
                ?disabled=${this._isProcessingScan ||
                this._isProcessingUpload ||
                this._isLoading}
                class="scan-button"
              >
                ${this._isProcessingScan ? "Scanning..." : "Scan from Canvas"}
              </sp-button>
            </div>
            <div class="search-controls">
              <input
                type="text"
                class="search-input native-input ${this._isAutoFilled
                  ? "auto-filled"
                  : ""}"
                placeholder="Search for memes or GIFs..."
                .value=${this._searchQuery}
                @input=${this._handleSearchInput}
                @keypress=${this._handleSearchKeyPress}
                ?disabled=${this._isLoading ||
                this._isProcessingUpload ||
                this._isProcessingScan}
              />
              <sp-button
                size="m"
                variant="primary"
                @click=${this._handleSearch}
                ?disabled=${this._isLoading ||
                this._isProcessingUpload ||
                this._isProcessingScan ||
                !this._searchQuery.trim()}
              >
                ${this._isLoading ? "Searching..." : "Search"}
              </sp-button>
            </div>

            ${this._errorMessage
              ? html` <div class="error-message">${this._errorMessage}</div> `
              : ""}
            ${this._isProcessingUpload
              ? html` <div class="loading">Processing image...</div> `
              : ""}
            ${this._isProcessingScan
              ? html` <div class="loading">Scanning canvas...</div> `
              : ""}
          </div>

          ${this._isLoading
            ? html` <div class="loading">Loading GIFs...</div> `
            : ""}
          ${!this._isLoading && this._searchResults.length > 0
            ? html`
                <div class="results-grid">
                  ${this._searchResults.map((result) => {
                    const previewUrl = getPreviewUrl(result);
                    const isInserting = this._insertingGifId === result.id;

                    return html`
                      <div class="gif-item">
                        ${previewUrl
                          ? html`
                              <img
                                src="${previewUrl}"
                                alt="${result.title || "GIF"}"
                                class="gif-preview"
                                loading="lazy"
                              />
                            `
                          : html`
                              <div class="gif-placeholder">
                                No preview available
                              </div>
                            `}
                        <sp-button
                          size="s"
                          variant="primary"
                          @click=${() => this._handleInsertGif(result)}
                          ?disabled=${isInserting ||
                          this._insertingGifId !== null}
                          class="insert-button"
                        >
                          ${isInserting ? "Inserting..." : "Add to Document"}
                        </sp-button>
                      </div>
                    `;
                  })}
                </div>
              `
            : ""}
          ${!this._isLoading &&
          this._searchResults.length === 0 &&
          this._searchQuery
            ? html`
                <div class="empty-state">
                  <p>No results found. Try searching for something else!</p>
                </div>
              `
            : ""}
          ${!this._isLoading &&
          this._searchResults.length === 0 &&
          !this._searchQuery
            ? html`
                <div class="welcome-state">
                  <p>Enter a keyword above to search for memes and GIFs!</p>
                </div>
              `
            : ""}
        </div>
      </sp-theme>
    `;
  }
}
