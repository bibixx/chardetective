const encodingNames = {
  utf8: ["UTF-8"],
  cesu8: ["CESU-8"],
  ucs2: ["UCS-2"],
  binary: ["Binary"],
  base64: ["Base 64"],
  hex: ["Hex"],
  utf32le: ["UTF-32 Little-Endian", "UTF-32 LE"],
  utf32be: ["UTF-32 Big-Endian", "UTF-32 BE"],
  utf32: ["UTF-32 (with BOM)", "UTF-32"],
  utf16be: ["UTF-16 Big-Endian", "UTF-32 BE"],
  utf16: ["UTF-16 (With BOM)", "UTF-16"],
  utf7: ["UTF-7"],
  utf7imap: ["UTF-7 (IMAP)"],
  maccenteuro: ["Mac OS Central European"],
  cp808: ["CP-808"],
  mik: ["MIK"],
  cp720: ["CP-720"],
  windows874: ["Windows 874 (Thai)", "Windows 874"],
  windows1250: ["Windows 1250 (Central European)", "Windows 1250"],
  windows1251: ["Windows 1251 (Cyrillic)", "Windows 1251"],
  windows1252: ["Windows 1252 (Western European)", "Windows 1252"],
  windows1253: ["Windows 1253 (Greek)", "Windows 1253"],
  windows1254: ["Windows 1254 (Turkish)", "Windows 1254"],
  windows1255: ["Windows 1255 (Hebrew)", "Windows 1255"],
  windows1256: ["Windows 1256 (Arabic)", "Windows 1256"],
  windows1257: ["Windows 1257 (Baltic)", "Windows 1257"],
  windows1258: ["Windows 1258 (Vietnamese)", "Windows 1258"],
  iso88591: ["ISO 8859-1 (Western Europe)", "ISO 8859-1"],
  iso88592: ["ISO-8859-2 (Central Europe)", "ISO-8859-2"],
  iso88593: ["ISO-8859-3 (Southern Europe)", "ISO-8859-3"],
  iso88594: ["ISO-8859-4 (Baltic)", "ISO-8859-4"],
  iso88595: ["ISO-8859-5 (Cyrillic)", "ISO-8859-5"],
  iso88596: ["ISO-8859-6 (Arabic)", "ISO-8859-6"],
  iso88597: ["ISO-8859-7 (Greek)", "ISO-8859-7"],
  iso88598: ["ISO-8859-8 (Hebrew)", "ISO-8859-8"],
  iso88599: ["ISO-8859-9 (Turkish)", "ISO-8859-9"],
  iso885910: ["ISO-8859-10 (Nordic)", "ISO-8859-10"],
  iso885911: ["ISO-8859-11 (Thai)", "ISO-8859-11"],
  iso885913: ["ISO-8859-13 (Baltic Rim)", "ISO-8859-13"],
  iso885914: ["ISO-8859-14 (Celtic)", "ISO-8859-14"],
  iso885915: ["ISO-8859-15 (Latin 9)", "ISO-8859-15"],
  iso885916: ["ISO-8859-16 (South-Eastern European)", "ISO-8859-16"],
  cp437: ["CP-437"],
  cp737: ["CP-737"],
  cp775: ["CP-775"],
  cp850: ["CP-850"],
  cp852: ["CP-852"],
  cp855: ["CP-855"],
  cp856: ["CP-856"],
  cp857: ["CP-857"],
  cp858: ["CP-858"],
  cp860: ["CP-860"],
  cp861: ["CP-861"],
  cp862: ["CP-862"],
  cp863: ["CP-863"],
  cp864: ["CP-864"],
  cp865: ["CP-865"],
  cp866: ["CP-866"],
  cp869: ["CP-869"],
  cp922: ["CP-922"],
  cp1046: ["CP-1046"],
  cp1124: ["CP-1124"],
  cp1125: ["CP-1125"],
  cp1129: ["CP-1129"],
  cp1133: ["CP-1133"],
  cp1161: ["CP-1161"],
  cp1162: ["CP-1162"],
  cp1163: ["CP-1163"],
  maccroatian: ["Mac OS Croatian"],
  maccyrillic: ["Mac OS Cyrillic"],
  macgreek: ["Mac OS Greek"],
  maciceland: ["Mac OS Iceland"],
  macroman: ["Mac OS Roman"],
  macromania: ["Mac OS Romania"],
  macthai: ["Mac OS Thai"],
  macturkish: ["Mac OS Turkish"],
  macukraine: ["Mac OS Ukraine"],
  koi8r: ["KOI8-R"],
  koi8u: ["KOI8-U"],
  koi8ru: ["KOI8-RU"],
  koi8t: ["KOI8-T"],
  armscii8: ["ArmSCII-8"],
  rk1048: ["RK1048"],
  tcvn: ["TCVN"],
  georgianacademy: ["Georgian Academy"],
  georgianps: ["Georgian PS"],
  pt154: ["PT154"],
  viscii: ["VISCII"],
  iso646cn: ["ISO-646-CN (PRC)", "ISO-646-CN"],
  iso646jp: ["ISO-646-JP (Japan (Romaji))", "ISO-646-JP"],
  hproman8: ["HP Roman-8"],
  macintosh: ["Macintosh"],
  ascii: ["ASCII"],
  tis620: ["TIS-620"],
  shiftjis: ["Shift JIS"],
  eucjp: ["EUC-JP"],
  cp936: ["CP-936"],
  gbk: ["GBK"],
  gb18030: ["GB 18030"],
  cp949: ["CP-949"],
  cp950: ["CP-950"],
  big5hkscs: ["Big5-HKSCS"],
};

type EncodingNames = typeof encodingNames;
// eslint-disable-next-line @typescript-eslint/ban-types
type Encoding = keyof EncodingNames | (string & {});
export const formatEncoding = (encoding: Encoding | null, length: "long" | "short" = "long") => {
  if (encoding == null) {
    return null;
  }

  const foundEncoding = (encodingNames as Record<string, EncodingNames[keyof EncodingNames]>)[encoding];
  if (foundEncoding == null) {
    return encoding;
  }

  const [long, short] = foundEncoding;

  if (short == null) {
    return long;
  }

  return length === "long" ? long : short;
};
