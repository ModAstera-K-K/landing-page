import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "jp"];
const defaultLocale = "en";
const cookieName = "i18nlang";

function getLocale(request: NextRequest): string {
  // 1. Check if there's a language cookie set
  if (request.cookies.has(cookieName)) {
    return request.cookies.get(cookieName)!.value;
  }

  // 2. Get accept-language header
  const acceptLanguage = request.headers.get("Accept-Language");
  if (!acceptLanguage) return defaultLocale;

  // 3. Parse accept-language header
  const headers = { "accept-language": acceptLanguage };
  const languages = new Negotiator({ headers }).languages();

  // 4. Match language preference
  try {
    // First try to match exact language codes
    const exactMatch = languages.find(lang => 
      lang.toLowerCase().startsWith('ja') || // Match Japanese
      lang.toLowerCase().startsWith('jp') // Match alternative Japanese code
    );
    
    if (exactMatch) {
      return 'jp';
    }

    // If no exact match, use intl-localematcher
    return match(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/_next")) return NextResponse.next();

  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  
  // Set locale to cookie
  response.cookies.set(cookieName, locale);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}