export type Letter = {
  char: string
  /** Label index used in Sign Language MNIST (0–25, J=9 & Z=25 absent) */
  label: number
  description: string
  similar: string[]
  /** J and Z need motion, so they are not part of the dataset */
  supported: boolean
}

const raw: Omit<Letter, "label" | "supported">[] = [
  { char: "A", description: "Tangan mengepal, ibu jari menempel di sisi telunjuk.", similar: ["E", "S", "T"] },
  { char: "B", description: "Empat jari lurus rapat ke atas, ibu jari dilipat ke telapak.", similar: ["U"] },
  { char: "C", description: "Jari-jari dan ibu jari melengkung membentuk huruf C.", similar: ["O"] },
  { char: "D", description: "Telunjuk tegak, jari lainnya menyentuh ujung ibu jari membentuk lingkaran.", similar: ["F", "O"] },
  { char: "E", description: "Ujung jari ditekuk ke bawah, menyentuh ibu jari yang terlipat.", similar: ["A", "S", "M"] },
  { char: "F", description: "Ibu jari dan telunjuk bersentuhan membentuk lingkaran, tiga jari lain tegak.", similar: ["D", "W"] },
  { char: "G", description: "Telunjuk dan ibu jari menunjuk ke samping, sejajar.", similar: ["H", "Q"] },
  { char: "H", description: "Telunjuk dan jari tengah menunjuk ke samping, rapat.", similar: ["G", "U"] },
  { char: "I", description: "Kelingking tegak, jari lainnya mengepal.", similar: ["Y"] },
  { char: "J", description: "Kelingking menggambar huruf J di udara (memerlukan gerakan).", similar: ["I"] },
  { char: "K", description: "Telunjuk dan jari tengah tegak membentuk V, ibu jari di antaranya.", similar: ["V", "P"] },
  { char: "L", description: "Telunjuk tegak dan ibu jari ke samping membentuk huruf L.", similar: ["G"] },
  { char: "M", description: "Ibu jari diselipkan di bawah telunjuk, jari tengah, dan jari manis.", similar: ["N", "E", "S"] },
  { char: "N", description: "Ibu jari diselipkan di bawah telunjuk dan jari tengah.", similar: ["M", "T"] },
  { char: "O", description: "Semua jari melengkung bertemu ibu jari membentuk lingkaran.", similar: ["C", "E"] },
  { char: "P", description: "Bentuk seperti K, tetapi tangan diarahkan ke bawah.", similar: ["K", "Q"] },
  { char: "Q", description: "Bentuk seperti G, tetapi tangan diarahkan ke bawah.", similar: ["G", "P"] },
  { char: "R", description: "Telunjuk dan jari tengah disilangkan.", similar: ["U", "V"] },
  { char: "S", description: "Tangan mengepal, ibu jari menyilang di depan jari-jari.", similar: ["A", "E", "T"] },
  { char: "T", description: "Ibu jari diselipkan di antara telunjuk dan jari tengah.", similar: ["A", "N", "S"] },
  { char: "U", description: "Telunjuk dan jari tengah tegak dan rapat.", similar: ["V", "R", "H"] },
  { char: "V", description: "Telunjuk dan jari tengah tegak terbuka membentuk V.", similar: ["U", "K", "W"] },
  { char: "W", description: "Telunjuk, jari tengah, dan jari manis tegak terbuka.", similar: ["V", "F"] },
  { char: "X", description: "Telunjuk ditekuk seperti kait, jari lainnya mengepal.", similar: ["D"] },
  { char: "Y", description: "Ibu jari dan kelingking terentang, jari lainnya mengepal.", similar: ["I"] },
  { char: "Z", description: "Telunjuk menggambar huruf Z di udara (memerlukan gerakan).", similar: ["D"] },
]

export const ALPHABET: Letter[] = raw.map((l, i) => ({
  ...l,
  label: i,
  supported: l.char !== "J" && l.char !== "Z",
}))

/** The 24 static classes the CNN predicts, in label order */
export const CLASSES = ALPHABET.filter((l) => l.supported)

export function getLetter(char: string) {
  return ALPHABET.find((l) => l.char === char)
}
