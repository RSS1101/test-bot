import { mkdir, readFile, writeFile } from 'node:fs/promises';

const source = (await readFile(new URL('./README.md', import.meta.url), 'utf8')).trim();
const [firstLine, ...remainingLines] = source.split(/\r?\n/);
const title = firstLine.replace(/^#\s+/, '');

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

const paragraphs = remainingLines.join('\n').trim().split(/\n\s*\n/)
  .filter(Boolean)
  .map((paragraph) => '<p>' + escapeHtml(paragraph) + '</p>')
  .join('\n');

const html = [
  '<!doctype html>',
  '<html lang="zh-CN">',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<title>' + escapeHtml(title) + '</title>',
  '<main>',
  '<h1>' + escapeHtml(title) + '</h1>',
  paragraphs,
  '</main>',
  '</html>',
].join('\n');

const output = new URL('./dist/', import.meta.url);
await mkdir(output, { recursive: true });
await writeFile(new URL('index.html', output), html + '\n');
