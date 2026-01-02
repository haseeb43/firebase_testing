// This file allows importing the global CSS file without type errors
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
