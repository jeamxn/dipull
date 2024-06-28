const parseCookies = () => {
  if (typeof document === "undefined") {
    return {};
  }
  const cookieString = document.cookie;
  return cookieString
    .split("; ")
    .reduce((acc: any, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = decodeURIComponent(value);
      return acc;
    }, {});
};

export const getCookieClient = (name: string) => { 
  return parseCookies()[name];
};