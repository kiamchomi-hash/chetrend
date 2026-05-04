import { 
  applyPaletteToDocument, 
  DEFAULT_CUSTOM_PALETTE_HEX, 
  DEFAULT_PALETTE_ID, 
  CUSTOM_PALETTE_ID,
  getActiveAccentColor 
} from "../palettes.js";

export class PaletteService {
  constructor(state, dom) {
    this.state = state;
    this.dom = dom;
  }

  apply() {
    if (typeof document === "undefined") {
      return;
    }

    applyPaletteToDocument(
      document.documentElement,
      this.state.theme,
      this.state.paletteId || DEFAULT_PALETTE_ID,
      this.state.customPaletteHex || DEFAULT_CUSTOM_PALETTE_HEX
    );

    this.updateFavicon();
  }

  updateFavicon() {
    const accentColor = getActiveAccentColor(
      this.state.theme,
      this.state.paletteId,
      this.state.customPaletteHex
    );

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="${accentColor}"/>
        <path d="M17 19h30v18c0 5.5-4.5 10-10 10H27c-5.5 0-10-4.5-10-10V19Z" fill="#fff7ef"/>
        <path d="M44 23h4.2c2.7 0 4.8 2.1 4.8 4.8s-2.1 4.8-4.8 4.8H44" stroke="#fff7ef" stroke-width="3" stroke-linecap="round"/>
        <path d="M22 48h20" stroke="#fff7ef" stroke-width="3" stroke-linecap="round"/>
        <path d="M26 14v7M32 11v10M38 14v7" stroke="#fff7ef" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `.trim();

    const encoded = encodeURIComponent(svg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;
    
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "shortcut icon";
      document.head.appendChild(link);
    }
    link.href = dataUrl;
  }

  persist() {
    if (typeof localStorage === "undefined") {
      return;
    }

    localStorage.setItem("chetrend-theme", this.state.theme);
    localStorage.setItem("chetrend-palette", this.state.paletteId);
    if (this.state.paletteId === CUSTOM_PALETTE_ID) {
      localStorage.setItem("chetrend-custom-palette-hex", this.state.customPaletteHex || DEFAULT_CUSTOM_PALETTE_HEX);
    }
  }

  syncControls(hexValue) {
    const normalized = hexValue.toUpperCase();

    this.dom.paletteOptionGrid
      ?.querySelectorAll("[data-custom-palette-hex]")
      ?.forEach((input) => {
        input.value = normalized;
        input.defaultValue = normalized;
        input.dataset.lastValid = normalized;
      });

    this.dom.paletteOptionGrid
      ?.querySelectorAll("[data-custom-palette-picker]")
      ?.forEach((input) => {
        input.value = normalized;
      });

    this.dom.paletteOptionGrid
      ?.querySelectorAll(".palette-option__color-preview")
      ?.forEach((preview) => {
        preview.style.setProperty("--palette-custom-preview", normalized);
      });
  }
}
