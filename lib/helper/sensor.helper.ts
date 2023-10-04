// Source https://raw.githubusercontent.com/lamhotsimamora/Filter-Kata-Kotor/master/filter-bad-word.js
// License https://raw.githubusercontent.com/lamhotsimamora/Filter-Kata-Kotor/master/LICENSE
const _badWord = [
  "Anjing",
  "Babi",
  "Kunyuk",
  "Bajingan",
  "ajg",
  "anjg",
  "anj",
  "mmk",
  "kntl",
  "bgst",
  "ppk",
  "Asu",
  "Bangsat",
  "Kampret",
  "Kontol",
  "Memek",
  "Ngentot",
  "Pentil",
  "Perek",
  "Pepek",
  "Pecun",
  "Bencong",
  "Banci",
  "Maho",
  "Gila",
  "Sinting",
  "Tolol",
  "Sarap",
  "Setan",
  "Lonte",
  "Hencet",
  "Taptei",
  "Kampang",
  "Pilat",
  "Keparat",
  "Bejad",
  "Gembel",
  "Brengsek",
  "Tai",
  "Anjrit",
  "Bangsat",
  "Fuck",
  "Tetek",
  "Ngulum",
  "Jembut",
  "Totong",
  "Kolop",
  "Pukimak",
  "Bodat",
  "Heang",
  "Jancuk",
  "Burit",
  "Titit",
  "Nenen",
  "Bejat",
  "Silit",
  "Sempak",
  "Fucking",
  "Asshole",
  "Bitch",
  "Penis",
  "Vagina",
  "Klitoris",
  "Kelentit",
  "Borjong",
  "Dancuk",
  "Pantek",
  "Taek",
  "Itil",
  "Teho",
  "Bejat",
  "Pantat",
  "Bagudung",
  "Babami",
  "Kanciang",
  "Bungul",
  "Idiot",
  "Kimak",
  "Henceut",
  "Kacuk",
  "Blowjob",
  "Pussy",
  "Dick",
  "Damn",
  "Ass",
];

export const filterBadWord = (
  str: string,
  txt: string = "***",
  dictionary: string[] = _badWord,
) => {
  for (const word of dictionary) {
    const lowerCaseBadWord = word.toLowerCase();
    const badWordFound = str.search(new RegExp(lowerCaseBadWord, "i"));

    if (badWordFound != -1) {
      str = str.split(lowerCaseBadWord).join(txt);
    }
  }

  return str;
};
