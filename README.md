# My Blog

A simple, themeable, client-side blog engine built with React and Tailwind CSS. This project allows you to display content from Markdown files in a clean, configurable interface without needing a backend.

## Features

-   **Markdown-based Content**: Reads and displays articles from a local `/md` directory.
-   **Themeable UI**: Customize the color scheme easily by editing `ui.json`.
-   **Dynamic Metadata**: Automatically parses creation dates from your markdown files.
-   **Client-Side Rendering**: No backend or build process required. Just serve the files.

## How It Works

The application loads its content by first reading a manifest file and then fetching each markdown file listed within it.

1.  **Content Folder**: All your articles live inside the `md/` directory.
2.  **The Manifest**: The app reads `md/file-manifest.json` to know which articles to load. This file is a simple JSON array of filenames.

### Adding New Articles

1.  Create a new `.md` file and save it inside the `md/` folder.
2.  Follow the format described below.
3.  Add the exact filename of your new article to the array in `md/file-manifest.json`.

For example, to add `My-New-Post.md`, your `file-manifest.json` would look like this:
```json
[
  "Welcome.md",
  "TypeScript-Benefits.md",
  "About-This-Project.md",
  "test.md",
  "My-New-Post.md"
]
```

### Markdown File Format

Each `.md` file should start with a description block. This block provides the summary and creation date for the article card on the main page.

```markdown
description
This is a short description of the article's content.
Created on YYYY-MM-DD
(end)

# This is the Main Title

And here is the rest of your Markdown content. The parser supports simple headers and paragraphs.
```

- The content between `description` and `(end)` is the summary.
- The `Created on [date]` line is optional, but if included, its content will be displayed.

### Theming

To change the look and feel of the site, edit the `ui.json` file. You can specify different [Tailwind CSS color names](https://tailwindcss.com/docs/customizing-colors) to change the theme. For a list of pre-made themes you can use, see the `themes.md` file.

Example `ui.json`:

```json
{
  "colors": {
    "background": "gray-900",
    "surface": "gray-800",
    "primary": "sky-500",
    "hover": "sky-600",
    "textPrimary": "gray-100",
    "textSecondary": "gray-400",
    "border": "gray-700"
  }
}
```
More themes at (themes.md)[https://github.com/createblogfromfile.cbff/blob/main/themes.md]

## Author

Created by **Dhruv Gowda**.

## License

This project is open source and licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

![CC BY 4.0](https://i.creativecommons.org/l/by/4.0/88x31.png)
