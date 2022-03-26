import { Element } from '../../stencil-public-runtime';
import { Subject } from 'rxjs';
import { Howl } from 'howler';
import { Alignment, Page } from '../../utils/utils';
export declare type InterfaceLanguage = "eng" | "fra";
export declare type Translation = {
  [lang in InterfaceLanguage]: string;
};
export declare class ReadAlongComponent {
  el: HTMLElement;
  /************
   *  PROPS   *
   ************/
  /**
   * The text as TEI
   */
  text: string;
  /**
   * The alignment as SMIL
   */
  alignment: string;
  processed_alignment: Alignment;
  /**
   * The audio file
   */
  audio: string;
  audio_howl_sprites: Howl;
  reading$: Subject<string>;
  duration: number;
  /**
   * Overlay
   * This is an SVG overlay to place over the progress bar
   */
  svgOverlay: string;
  /**
   * Theme to use: ['light', 'dark'] defaults to 'dark'
   */
  theme: string;
  /**
   * Language  of the interface. In 639-3 code
   * Options are
   * - "eng" for English
   * - "fra" for French
   */
  language: InterfaceLanguage;
  /**
   * Optional custom Stylesheet to override defaults
   */
  cssUrl?: string;
  /**
   * Toggle the use of assets folder for resolving urls. Defaults to on
   * to maintain backwards compatibility
   */
  useAssetsFolder: boolean;
  /**
   * Toggles the page scrolling from horizontal to vertical. Defaults to horizontal
   *
   */
  pageScrolling: "horizontal" | "vertical";
  /************
   *  STATES  *
   ************/
  /**
   * Whether audio is playing or not
   */
  playing: boolean;
  play_id: number;
  playback_rate: number;
  fullscreen: boolean;
  autoScroll: boolean;
  isLoaded: boolean;
  showGuide: boolean;
  parsed_text: any;
  current_page: any;
  hasTextTranslations: boolean;
  assetsStatus: {
    AUDIO: number;
    XML: number;
    SMIL: number;
  };
  /************
   *  LISTENERS  *
   ************/
  wheelHandler(event: MouseEvent): void;
  /***********
   *  UTILS  *
   ***********/
  /**
   * Transforms a given path to either use the default assets folder or rely on the absolute path given
   * @param path
   * @return string
   */
  private urlTransform;
  /**
   * Given an audio file path and a parsed alignment object,
   * build a Sprite object
   * @param audio
   * @param alignment
   */
  private buildSprite;
  /**
   * Add escape characters to query selector param
   * @param id
   */
  tagToQuery(id: string): string;
  /**
   * Return HTML element of word closest to second s
   *
   * @param s seconds
   */
  returnWordClosestTo(s: number): HTMLElement;
  /*************
   *   AUDIO   *
   *************/
  /**
   * Change playback between .75 and 1.25. To change the playback options,
   * change the HTML in the function renderControlPanel
   *
   * @param ev
   */
  changePlayback(ev: Event): void;
  /**
   *  Go back s milliseconds
   *
   * @param s
   */
  goBack(s: number): void;
  /**
   *  Highlight specific wording given by time.
   *
   * @param s
   */
  goToTime(time: number): void;
  /**
   * Get the Time for given element.
   *
   * @param ev
   */
  getTime(tag: number): number;
  /**
   * Go to seek
   *
   * @param seek number
   *
   */
  goTo(seek: number): void;
  /**
   * Go to seek from id
   *
   * @param ev
   */
  goToSeekAtEl(ev: MouseEvent): string;
  /**
   * Go to seek from progress bar
   */
  goToSeekFromProgress(ev: MouseEvent): void;
  /**
   * Pause audio.
   */
  pause(): void;
  /**
   * Play the current audio, or start a new play of all
   * the audio
   *
   *
   */
  play(): void;
  /**
   * Seek to an element with id 'id', then play it
   *
   * @param ev
   */
  playSprite(ev: MouseEvent): void;
  /**
   * Stop the sound and remove all active reading styling
   */
  stop(): void;
  /**
   * toggle the visibility of translation text
   */
  toggleTextTranslation(): void;
  /*************
   * ANIMATION *
   *************/
  /**
   * Remove highlighting from every other word and add it to el
   *
   * @param el
   */
  addHighlightingTo(el: HTMLElement): void;
  /**
   * Animate the progress through the overlay svg
   */
  animateProgressWithOverlay(): void;
  /**
   * Animate the progress if no svg overlay is provided
   *
   * @param play_id
   * @param tag
   */
  animateProgressDefault(play_id: number, tag: string): void;
  /**
   * Animate progress, either by default or with svg overlay.
   */
  animateProgress(play_id?: number): void;
  /**
   * Change fill colour to match theme
   */
  changeFill(): void;
  /**
   * Change theme
   */
  changeTheme(): void;
  /**
   * Return the Sentence Container of Word
   * Currently the 3rd parent up the tree node
   * @param element
   * @private
   */
  private static _getSentenceContainerOfWord;
  /**
   * Make Fullscreen
   */
  private toggleFullscreen;
  /*************
   * SCROLLING *
   *************/
  hideGuideAndScroll(): void;
  inParagraphContentOverflow(element: HTMLElement): boolean;
  inPageContentOverflow(element: HTMLElement): boolean;
  inPage(element: HTMLElement): boolean;
  scrollToPage(pg_id: string): void;
  scrollByHeight(el: HTMLElement): void;
  scrollByWidth(el: HTMLElement): void;
  scrollTo(el: HTMLElement): void;
  /****
   * AUDIO HANDLING
   *
   */
  audioFailedToLoad(): void;
  audioLoaded(): void;
  /*************
   * LIFECYCLE *
   *************/
  /**
   * When the component updates, change the fill of the progress bar.
   * This is because the fill colour is determined by a computed CSS
   * value set by the Web Component's theme. When the @prop theme changes and
   * the component updates, we have to update the fill with the new
   * computed CSS value.
   */
  componentDidUpdate(): void;
  /**
   * Using this Lifecycle hook to handle backwards compatibility of component attribute
   */
  componentWillLoad(): void;
  /**
   * Lifecycle hook: after component loads, build the Sprite and parse the files necessary.
   * Then subscribe to the _reading$ Subject in order to update CSS styles when new element
   * is being read
   */
  componentDidLoad(): void;
  /**********
   *  LANG  *
   **********/
  /**
   * Any text used in the Web Component should be at least bilingual in English and French.
   * To add a new term, add a new key to the translations object. Then add 'eng' and 'fr' keys
   * and give the translations as values.
   *
   * @param word
   * @param lang
   */
  returnTranslation(word: string, lang?: InterfaceLanguage): string;
  /**********
   * RENDER *
   **********/
  /**
   * The Guide element
   */
  Guide: () => Element;
  /**
   * Render svg overlay
   */
  Overlay: () => Element;
  /**
   * Render image at path 'url' in assets folder.
   *
   * @param props
   */
  Img: (props: {
    url: string;
  }) => Element;
  /**
   * Page Counter element
   *
   * @param props
   *
   * Shows currentPage / pgCount
   */
  PageCount: (props: {
    pgCount: number;
    currentPage: number;
  }) => Element;
  /**
   * Page element
   *
   * @param props
   *
   * Show 'Page' or vertically scrollable text content.
   * Text content on 'Page' breaks is separated horizontally.
   */
  Page: (props: {
    pageData: Page;
  }) => Element;
  /**
   * Paragraph element
   *
   * @param props
   *
   * A paragraph element with one or more sentences
   */
  Paragraph: (props: {
    sentences: Node[];
    attributes: NamedNodeMap;
  }) => Element;
  /**
   * Sentence element
   *
   * @param props
   *
   * A sentence element with one or more words
   */
  Sentence: (props: {
    words: Node[];
    attributes: NamedNodeMap;
  }) => Element;
  /**
   * A non-Word text element
   *
   * @param props
   *
   * This is an element that is a child to a Sentence element,
   * but cannot be clicked and is not a word. This is usually
   * inter-Word punctuation or other text.
   */
  NonWordText: (props: {
    text: string;
    id: string;
    attributes: NamedNodeMap;
  }) => Element;
  /**
   * A Word text element
   *
   * @param props
   *
   * This is a clickable, audio-aligned Word element
   */
  Word: (props: {
    id: string;
    text: string;
    attributes: NamedNodeMap;
  }) => Element;
  /**
   * Render controls for ReadAlong
   */
  PlayControl: () => Element;
  ReplayControl: () => Element;
  StopControl: () => Element;
  PlaybackSpeedControl: () => Element;
  StyleControl: () => Element;
  FullScreenControl: () => Element;
  TextTranslationDisplayControl: () => Element;
  ControlPanel: () => Element;
  /**
   * Render main component
   */
  render(): Element;
}
