export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    hover: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
}

export interface ParsedMarkdown {
  title: string;
  description: string;
  content: string;
  date?: string;
}
