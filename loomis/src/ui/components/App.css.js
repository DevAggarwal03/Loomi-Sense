import { css } from "lit";

export const style = css`
  .container {
    margin: 16px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .title {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .search-section {
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .upload-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .upload-button,
  .scan-button {
    flex: 1;
  }

  .search-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  .search-input {
    flex: 1;
  }

  .native-input {
    padding: 8px 12px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    font-size: 14px;
    font-family: var(--spectrum-global-font-family-base);
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-50);
    transition: border-color 0.2s;
  }

  .native-input:focus {
    outline: none;
    border-color: var(--spectrum-global-color-blue-500);
  }

  .native-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .native-input::placeholder {
    color: var(--spectrum-global-color-gray-500);
  }

  .native-input.auto-filled {
    border-color: var(--spectrum-global-color-blue-400);
    background-color: var(--spectrum-global-color-blue-50);
    box-shadow: 0 0 0 1px var(--spectrum-global-color-blue-400);
  }

  .native-input.auto-filled:focus {
    border-color: var(--spectrum-global-color-blue-500);
    box-shadow: 0 0 0 2px var(--spectrum-global-color-blue-500);
  }

  .error-message {
    padding: 8px 12px;
    background-color: var(--spectrum-global-color-red-100);
    color: var(--spectrum-global-color-red-700);
    border-radius: 4px;
    font-size: 12px;
    margin-top: 8px;
  }

  .loading {
    text-align: center;
    padding: 32px;
    color: var(--spectrum-global-color-gray-700);
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    overflow-y: auto;
    flex: 1;
    padding-bottom: 16px;
  }

  .gif-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    padding: 8px;
    background-color: var(--spectrum-global-color-gray-50);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .gif-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .gif-preview {
    width: 100%;
    height: auto;
    border-radius: 4px;
    object-fit: contain;
    background-color: var(--spectrum-global-color-gray-100);
    min-height: 100px;
    max-height: 200px;
  }

  .gif-placeholder {
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }

  .insert-button {
    width: 100%;
  }

  .empty-state,
  .welcome-state {
    text-align: center;
    padding: 48px 16px;
    color: var(--spectrum-global-color-gray-600);
  }

  .empty-state p,
  .welcome-state p {
    margin: 0;
    font-size: 14px;
  }
`;
