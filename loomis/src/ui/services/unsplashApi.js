/**
 * Unsplash API Service
 * Service to interact with Unsplash API for stock photos, backgrounds, and illustrations
 *
 * API Documentation: https://unsplash.com/documentation
 *
 * To get a free API key:
 * 1. Visit https://unsplash.com/developers
 * 2. Create an application
 * 3. Get your Access Key
 * 4. Add to .env: UNSPLASH_ACCESS_KEY=your_key_here
 *
 * Rate Limits:
 * - Demo mode: 50 requests/hour
 * - Production: Higher limits after approval
 */

const UNSPLASH_ACCESS_KEY =
  process.env.UNSPLASH_ACCESS_KEY || "05PJJ2A5cuhf4deknYfTR_C_gKp5PCqGAZC2r7Q9kdA";
const UNSPLASH_BASE_URL = "https://api.unsplash.com";

if (UNSPLASH_ACCESS_KEY.length === 0) {
  console.warn(
    "UNSPLASH_ACCESS_KEY is not set. Please create a .env file with UNSPLASH_ACCESS_KEY=your_key"
  );
}

/**
 * Clean and normalize search query
 * @param {string} query - Raw user input
 * @returns {string} - Cleaned query
 */
export function cleanQuery(query) {
  if (!query || typeof query !== "string") {
    return "";
  }

  let cleaned = query.trim();
  cleaned = cleaned.replace(/\s+/g, " ");

  if (cleaned.length > 100) {
    cleaned = cleaned.substring(0, 100);
  }

  return cleaned;
}

/**
 * Search for images using Unsplash API
 * https://unsplash.com/documentation#search-photos
 *
 * @param {string} query - Search query (required)
 * @param {Object} options - Search options
 * @param {number} options.perPage - Number of results per page (default: 10, max: 30)
 * @param {number} options.page - Page number for pagination (default: 1)
 * @param {string} options.orientation - Filter by orientation: 'landscape', 'portrait', 'squarish' (optional)
 * @param {string} options.color - Filter by color: 'black_and_white', 'black', 'white', 'yellow', 'orange', 'red', 'purple', 'magenta', 'green', 'teal', 'blue' (optional)
 * @param {string} options.orderBy - Sort order: 'relevant', 'latest' (default: 'relevant')
 * @param {string} options.contentFilter - Content safety filter: 'low', 'high' (default: 'low')
 * @returns {Promise<Object>} - API response with results
 */
export async function searchImages(query, options = {}) {
  const cleanedQuery = cleanQuery(query);

  if (!cleanedQuery) {
    throw new Error("Search query cannot be empty");
  }

  if (UNSPLASH_ACCESS_KEY.length === 0) {
    throw new Error("Unsplash API key is not configured");
  }

  const {
    perPage = 10,
    page = 1,
    orientation,
    color,
    orderBy = "relevant",
    contentFilter = "low",
  } = options;

  // Build URL parameters per API docs
  const params = new URLSearchParams({
    query: cleanedQuery,
    page: page.toString(),
    per_page: Math.min(Math.max(perPage, 1), 30).toString(),
    order_by: orderBy,
    content_filter: contentFilter,
  });

  // Optional filters
  if (orientation && ["landscape", "portrait", "squarish"].includes(orientation)) {
    params.append("orientation", orientation);
  }

  if (color) {
    params.append("color", color);
  }

  const url = `${UNSPLASH_BASE_URL}/search/photos?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid Unsplash API key");
      }
      if (response.status === 403) {
        throw new Error("Unsplash API rate limit exceeded (50 req/hr in demo mode)");
      }
      throw new Error(
        `Unsplash API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Response format per docs: { total, total_pages, results: [...] }
    return {
      results: data.results || [],
      total: data.total || 0,
      totalPages: data.total_pages || 0,
      currentPage: page,
    };
  } catch (error) {
    console.error("Unsplash API error:", error);
    throw error;
  }
}

/**
 * Search for background images (abstract, textures, patterns)
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @returns {Promise<Object>} - API response with results
 */
export async function searchBackgrounds(query, limit = 10) {
  // Enhance query for background-suitable results
  const enhancedQuery = `${query} background texture abstract`;
  return searchImages(enhancedQuery, {
    perPage: limit,
    orientation: "landscape",
    orderBy: "relevant",
  });
}

/**
 * Search for illustrations and artistic images
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @returns {Promise<Object>} - API response with results
 */
export async function searchIllustrations(query, limit = 10) {
  // Enhance query for illustration-style results
  const enhancedQuery = `${query} illustration art graphic`;
  return searchImages(enhancedQuery, {
    perPage: limit,
    orderBy: "relevant",
  });
}

/**
 * Search for general photos
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @returns {Promise<Object>} - API response with results
 */
export async function searchPhotos(query, limit = 10) {
  return searchImages(query, {
    perPage: limit,
    orderBy: "relevant",
  });
}

/**
 * Get the full-size image URL from Unsplash result
 * Per docs, URLs include: raw, full, regular, small, thumb
 *
 * @param {Object} result - Unsplash API result object
 * @param {string} size - 'raw', 'full', 'regular', 'small', 'thumb' (default: 'regular')
 * @returns {string|null} - Image URL or null if not found
 */
export function getImageUrl(result, size = "regular") {
  if (!result || !result.urls) {
    return null;
  }

  // Priority order for size fallback
  const sizePriority = ["regular", "small", "full", "thumb", "raw"];

  if (result.urls[size]) {
    return result.urls[size];
  }

  // Fallback to available sizes
  for (const s of sizePriority) {
    if (result.urls[s]) {
      return result.urls[s];
    }
  }

  return null;
}

/**
 * Get preview/thumbnail URL for gallery display
 * Uses 'small' (400px width) for optimal preview quality
 *
 * @param {Object} result - Unsplash API result object
 * @returns {string|null} - Preview URL or null if not found
 */
export function getPreviewUrl(result) {
  if (!result || !result.urls) {
    return null;
  }

  // Use small for previews (400px), fallback to thumb (200px)
  return result.urls.small || result.urls.thumb || result.urls.regular || null;
}

/**
 * Get image metadata from Unsplash result
 * @param {Object} result - Unsplash API result object
 * @returns {Object} - Metadata object
 */
export function getImageMetadata(result) {
  if (!result) {
    return {};
  }

  return {
    id: result.id,
    description: result.description || result.alt_description || "",
    author: result.user?.name || "Unknown",
    authorUsername: result.user?.username || "",
    authorProfileUrl: result.user?.links?.html || "",
    width: result.width,
    height: result.height,
    color: result.color, // Dominant color
    blurHash: result.blur_hash, // BlurHash placeholder
    downloadUrl: result.links?.download,
    htmlUrl: result.links?.html,
    // For attribution: "Photo by {author} on Unsplash"
    attributionUrl: result.links?.html,
  };
}

/**
 * Track download (REQUIRED by Unsplash API guidelines)
 * Must be called when a photo is downloaded/used in a design
 * https://unsplash.com/documentation#track-a-photo-download
 *
 * @param {Object} result - Unsplash API result object
 */
export async function trackDownload(result) {
  if (!result?.links?.download_location) {
    console.warn("No download_location found for Unsplash image");
    return;
  }

  try {
    await fetch(result.links.download_location, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });
  } catch (error) {
    // Silently fail - tracking is best-effort but required by guidelines
    console.warn("Failed to track Unsplash download:", error);
  }
}

/**
 * Format Unsplash result to match our internal asset format
 * @param {Object} result - Unsplash API result object
 * @param {string} elementType - 'background', 'backgrounds', 'illustrations', 'images'
 * @returns {Object} - Formatted asset object
 */
export function formatAsPreviewItem(result, elementType) {
  const metadata = getImageMetadata(result);

  return {
    id: `unsplash_${result.id}`,
    source: "unsplash",
    preview_url: getPreviewUrl(result),
    full_url: getImageUrl(result, "regular"),
    metadata: metadata,
    add_to_canvas_action: {
      type:
        elementType === "background" || elementType === "backgrounds"
          ? "add_background"
          : "add_image",
      asset_id: result.id,
      source: "unsplash",
    },
    // Keep original result for tracking and attribution
    _original: result,
  };
}

/**
 * Generate attribution text per Unsplash guidelines
 * @param {Object} result - Unsplash API result object
 * @returns {string} - Attribution text
 */
export function getAttributionText(result) {
  if (!result?.user) {
    return "Photo from Unsplash";
  }

  const authorName = result.user.name || result.user.username || "Unknown";
  return `Photo by ${authorName} on Unsplash`;
}
