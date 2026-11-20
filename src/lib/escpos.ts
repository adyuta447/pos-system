const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;
const UNKNOWN_CHAR = 0x3f; // '?'

interface Options {
  boldFirstLine?: boolean;
}

/** Plain text lines -> ESC/POS bytes: init, text, feed, partial cut. Non-ASCII becomes '?'. */
export default function encodeEscPos(
  lines: string[],
  { boldFirstLine = false }: Options = {},
): Uint8Array {
  const bytes: number[] = [ESC, 0x40];
  lines.forEach((line, index) => {
    const bold = boldFirstLine && index === 0;
    if (bold) bytes.push(ESC, 0x45, 1);
    for (const char of line) {
      const code = char.charCodeAt(0);
      bytes.push(code >= 0x20 && code < 0x7f ? code : UNKNOWN_CHAR);
    }
    bytes.push(LF);
    if (bold) bytes.push(ESC, 0x45, 0);
  });
  bytes.push(ESC, 0x64, 4); // feed 4 lines
  bytes.push(GS, 0x56, 1); // partial cut, ignored by printers without a cutter
  return Uint8Array.from(bytes);
}
