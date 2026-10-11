import { copyFile, mkdir } from 'node:fs/promises';

const output = new URL('../dist/public/', import.meta.url);
const entry = new URL('index.html', output);

// GitHub Pages needs a real entry file for each client-side route.
for (const route of ['rsvp/questions/', 'rsvp/details/']) {
  const directory = new URL(route, output);
  await mkdir(directory, { recursive: true });
  await copyFile(entry, new URL('index.html', directory));
}

await copyFile(entry, new URL('404.html', output));
