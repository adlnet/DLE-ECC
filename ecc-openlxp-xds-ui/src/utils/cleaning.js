'use strict';

export function removeHTML(html) {
  if (!html) return '';

  html = html.replaceAll(/<[^>]*>?/gm, '');

  // replaceAll any non-breaking spaces with normal spaces
  html = html.replaceAll('&nbsp', ' ');

  // remove any apos
  html = html.replaceAll('&apos', "'");

  // remove any ampersands
  html = html.replaceAll('&amp', '&');

  // remove any quotes
  html = html.replaceAll('&quot', '"');

  // remove any less than signs
  html = html.replaceAll('&lt', '<');

  // remove any greater than signs
  html = html.replaceAll('&gt', '>');

  // remove any leading or trailing spaces
  html = html.trim();

  // remove any double spaces
  html = html.replaceAll(/\s\s+/g, ' ');

  // remove any trailing newlines
  html = html.replaceAll(/\n\s*\n/g, '\n');

  // remove any leading newlines
  html = html.replaceAll(/^\s*\n/g, '');
  return html;
}
