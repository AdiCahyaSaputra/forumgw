import { ReadonlyURLSearchParams } from "next/navigation";

export const generateAnonymousRandomString = (length: number) => {
  let result = "";

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
};

export const trimUserProfileName = (name: string) => {
  if (name.length <= 15) return name;

  const splittedName = name.split("");
  splittedName.splice(12, name.length - 12, "...");

  return splittedName.join("");
};

export const checkCurrentActiveUrl = (
  pathname: string | null,
  url: string,
  query: ReadonlyURLSearchParams | null,
) => {
  if (!pathname && !query) return false;

  if (query?.get("c")) {
    const currentUrl = pathname + "?c=" + query.get("c");
    return currentUrl === url;
  }

  if (url.startsWith("/kelola")) {
    return pathname === url;
  }

  return pathname?.startsWith(url);
};

export const getMetaData = (createdAt: string | Date) => {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);

  const formatter = new Intl.RelativeTimeFormat("id");
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };

  // EXPLAIN: detik yg sudah berlalu di jadiin Math.abs (jadi angka positif) xxx.123 (karena di bagi 1000 makannya ada 3 angka di belakang)
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;

  // console.log('sebelum /1000 ' + (date.getTime() - Date.now()))
  // console.log('sesudah /1000 ' + Math.abs(secondsElapsed))

  type TRange = keyof typeof ranges;

  for (let key in ranges) {
    // EXPLAIN: apakah detik yang sudah berlalu tersebut melebihi dari ranges[key] ? jika iya maka range nya adalah ranges[key] contoh (secondsElapsed sudah melebihi 3600 / 1 jam lebih lah) maka range nya adalah hours / jam jika sudah melebihi 1 hari maka range nya day / hari dst..
    if (ranges[key as TRange] < Math.abs(secondsElapsed)) {
      // console.log(key, ranges[key as TRange])
      const delta = secondsElapsed / ranges[key as TRange];
      return formatter.format(Math.round(delta), key as TRange);
    }
  }
};

export const truncateThousand = (number: number): string => {
  if (number >= 1000) {
    const truncatedNumber = number / 1000;

    return truncatedNumber % 1 === 0
      ? `${truncatedNumber}K`
      : `${truncatedNumber.toFixed(1)}K`;
  }

  return number.toString();
};
