export interface Page {
  id: string;
  paragraphs: Node[];
  img?: string;
  attributes?: NamedNodeMap[];
}
export interface Alignment {
  [id: string]: [number, number];
}
/**
 * Return a zipped array of arrays
 * @param {array[]} arrays
 */
export declare function zip(arrays: any): Array<any[]>;
/**
 * Return sentences from TEI xml file
 * @param {string} - the path to the TEI file
 */
export declare function parseTEI(path: string): Page[];
/**
 * Return useful data from SMIL xml file
 * @param {string} - the path to the SMIL file
 */
export declare function parseSMIL(path: string): Alignment;
/**
 * Sprite class containing the state of our sprites to play and their progress.
 * @param {Object} options Settings to pass into and setup the sound and visuals.
 */
export declare var Sprite: (options: any) => void;
