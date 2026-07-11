import { getRequestConfig } from 'next-intl/server';
import { getMessagesForLocale, getValidLocale } from './locale';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = getValidLocale(requested);

  return {
    locale,
    messages: getMessagesForLocale(locale),
  };
});
