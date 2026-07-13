import { cookies } from 'next/headers';
import { getValidLocale, type Locale } from '@/i18n/locale';

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return getValidLocale(cookieStore.get('app_language')?.value);
}
