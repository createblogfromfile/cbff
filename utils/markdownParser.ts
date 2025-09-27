import { ParsedMarkdown } from '../types';

export function parseMarkdownFile(fileName: string, rawContent: string): ParsedMarkdown {
  const title = fileName.replace('.md', '');
  let description = '';
  let content = rawContent;
  let date: string | undefined = undefined;

  const descriptionRegex = /^description\n([\s\S]*?)\n\(end\)\n?/;
  const match = rawContent.match(descriptionRegex);

  if (match && match[1]) {
    const fullDescriptionBlock = match[1].trim();
    content = rawContent.replace(descriptionRegex, '').trim();

    const lines = fullDescriptionBlock.split('\n');
    const dateLineIndex = lines.findIndex(line => line.trim().startsWith('Created on'));
    
    if (dateLineIndex !== -1) {
      const dateLine = lines[dateLineIndex].trim();
      date = dateLine.replace('Created on', '').trim();
      lines.splice(dateLineIndex, 1);
    }
    
    description = lines.join('\n').trim();
  }

  return { title, description, content, date };
}
