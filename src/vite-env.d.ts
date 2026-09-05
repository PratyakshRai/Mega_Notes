/// <reference types="vite/client" />

// Allow importing Markdown files as raw strings
declare module '*.md?raw' {
  const content: string;
  export default content;
}

// Allow image imports
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
