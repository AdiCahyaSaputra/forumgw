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
  query: ReadonlyURLSearchParams | null
) => {
  if (!pathname && !query) return false;

  if (query?.get("c")) {
    const currentUrl = pathname + "?c=" + query.get("c");
    return currentUrl === url;
  }

  return pathname === url;
};
