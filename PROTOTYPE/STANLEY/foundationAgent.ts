import { chromium, Browser, BrowserContext, Page, BrowserContextOptions } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export interface InteractionEvent {
  eventType: string;
  selector: string;
  value: string | null;
  textContent: string;
  currentUrl: string;
  timestamp: number;
}

export interface AgentConfig {
  headless?: boolean;
  userAgent?: string;
  viewport?: { width: number; height: number };
  statePath?: string;
}

/**
 * Project Stanley Generic Framework Core (StanleyFoundation)
 * 
 * Manages non-headless browser lifecycles, persists session states, 
 * and implements a client-side 'Record-and-Generalize' listener to capture
 * user click, change, and submit paths into serialized macro timelines.
 */
export class StanleyFoundation {
  protected config: AgentConfig;
  protected browser: Browser | null = null;
  protected context: BrowserContext | null = null;
  protected page: Page | null = null;
  protected interactionTimeline: InteractionEvent[] = [];

  constructor(config: AgentConfig = {}) {
    this.config = {
      headless: false, // Strict user directive: Must run headful so users can solve CAPTCHAs/MFA
      userAgent: config.userAgent ?? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      viewport: config.viewport ?? { width: 1280, height: 800 },
      statePath: config.statePath ?? path.join(process.cwd(), 'stanley_session_state.json'),
      ...config
    };
  }

  /**
   * Initializes the Playwright browser session.
   * Restores session storageState if it exists, exposes the event logger callback,
   * and registers the DOM event listener script.
   */
  public async initialize(): Promise<Page> {
    console.log("[StanleyFoundation] Launching headful Chromium browser...");
    
    this.browser = await chromium.launch({
      headless: false, // Strict directive
      args: [
        '--disable-blink-features=AutomationControlled', // Evade simple webdriver flags
        '--no-sandbox'
      ]
    });

    const contextOptions: BrowserContextOptions = {
      userAgent: this.config.userAgent,
      viewport: this.config.viewport,
    };

    if (this.config.statePath && fs.existsSync(this.config.statePath)) {
      console.log(`[StanleyFoundation] Restoring state session from: ${this.config.statePath}`);
      try {
        const stateText = fs.readFileSync(this.config.statePath, 'utf-8');
        contextOptions.storageState = JSON.parse(stateText);
      } catch (err) {
        console.error("[StanleyFoundation] Failed to load session state JSON:", err);
      }
    }

    this.context = await this.browser.newContext(contextOptions);
    this.page = await this.context.newPage();

    // Mask the window.navigator.webdriver automation attribute
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    // Expose the node event logging function to the browser window context
    await this.page.exposeFunction('logStanleyEvent', (event: InteractionEvent) => {
      console.log(`[StanleyFoundation Event Logged] ${event.eventType.toUpperCase()} on "${event.selector}"`);
      this.interactionTimeline.push(event);
    });

    // Inject global DOM event listener script
    await this.page.addInitScript(() => {
      // Helper function to dynamically construct a unique CSS selector path for any element
      function computeCssSelector(el: HTMLElement | null): string {
        if (!el) return '';
        if (el.id) return `#${el.id}`;
        
        const pathParts: string[] = [];
        let current: HTMLElement | null = el;

        while (current && current.nodeType === Node.ELEMENT_NODE) {
          let selector = current.nodeName.toLowerCase();
          
          if (current.className) {
            // Filter classes, escaping spaces or odd tokens
            const classNames = current.className
              .split(/\s+/)
              .map(c => c.trim())
              .filter(c => c.length > 0 && !c.includes(':') && !c.includes('[')); // omit Tailwind dynamic parts
            
            if (classNames.length > 0) {
              selector += `.${classNames.join('.')}`;
            }
          }
          
          const parent = current.parentNode as HTMLElement | null;
          if (parent) {
            const siblings = Array.from(parent.children);
            if (siblings.length > 1) {
              const index = siblings.indexOf(current) + 1;
              selector += `:nth-child(${index})`;
            }
          }
          
          pathParts.unshift(selector);
          current = parent;
        }
        
        return pathParts.join(' > ');
      }

      // Event Listener for clicks (excluding clicks on textboxes/inputs to prevent double logging)
      document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;
        
        const tagName = target.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return;

        (window as unknown as { logStanleyEvent: (event: object) => void }).logStanleyEvent({
          eventType: 'click',
          selector: computeCssSelector(target),
          value: null,
          textContent: target.textContent?.trim().slice(0, 150) || '',
          currentUrl: window.location.href,
          timestamp: Date.now()
        });
      }, true);

      // Event Listener for inputs and textchanges
      document.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target) return;

        (window as unknown as { logStanleyEvent: (event: object) => void }).logStanleyEvent({
          eventType: 'change',
          selector: computeCssSelector(target),
          value: target.type === 'password' ? '********' : target.value,
          textContent: '',
          currentUrl: window.location.href,
          timestamp: Date.now()
        });
      }, true);

      // Event Listener for form submits
      document.addEventListener('submit', (e: Event) => {
        const target = e.target as HTMLFormElement;
        if (!target) return;

        (window as unknown as { logStanleyEvent: (event: object) => void }).logStanleyEvent({
          eventType: 'submit',
          selector: computeCssSelector(target),
          value: null,
          textContent: 'Form Submit',
          currentUrl: window.location.href,
          timestamp: Date.now()
        });
      }, true);
    });

    return this.page;
  }

  /**
   * Navigates the current browser page to a target URL.
   */
  public async navigate(url: string): Promise<void> {
    if (!this.page) throw new Error("Agent browser session is not initialized.");
    console.log(`[StanleyFoundation] Navigating context to: ${url}`);
    await this.page.goto(url, { waitUntil: 'load' });
  }

  /**
   * Helper to wait for a specific duration in milliseconds.
   */
  public async wait(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Wait for selector helper.
   */
  public async waitForSelector(selector: string, timeout: number = 10000): Promise<void> {
    if (!this.page) throw new Error("Agent browser session is not initialized.");
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Clicks a target selector.
   */
  public async click(selector: string): Promise<void> {
    if (!this.page) throw new Error("Agent browser session is not initialized.");
    await this.page.click(selector);
  }

  /**
   * Types text into a target input.
   */
  public async type(selector: string, text: string): Promise<void> {
    if (!this.page) throw new Error("Agent browser session is not initialized.");
    await this.page.fill(selector, text);
  }

  /**
   * Saves the browser state (cookies + local storage contents) to file.
   */
  public async saveState(): Promise<void> {
    if (!this.context || !this.config.statePath) throw new Error("Browser context not established.");
    console.log(`[StanleyFoundation] Saving session state to: ${this.config.statePath}`);
    const state = await this.context.storageState();
    fs.writeFileSync(this.config.statePath, JSON.stringify(state, null, 2), 'utf-8');
  }

  /**
   * Serializes the captured timeline events to a JSON configuration block on disk.
   */
  public saveMacroTimeline(filename: string): void {
    const outputPath = path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename);
    console.log(`[StanleyFoundation] Serializing ${this.interactionTimeline.length} macro steps to: ${outputPath}`);
    
    try {
      const dataStr = JSON.stringify(this.interactionTimeline, null, 2);
      fs.writeFileSync(outputPath, dataStr, 'utf-8');
    } catch (err) {
      console.error(`[StanleyFoundation] Error serializing macro timeline to ${outputPath}:`, err);
    }
  }

  /**
   * Returns current timeline.
   */
  public getTimeline(): InteractionEvent[] {
    return this.interactionTimeline;
  }

  /**
   * Closes browser sessions cleanly.
   */
  public async cleanup(): Promise<void> {
    console.log("[StanleyFoundation] Cleaning up browser processes...");
    if (this.browser) {
      await this.browser.close();
    }
    this.browser = null;
    this.context = null;
    this.page = null;
  }
}
