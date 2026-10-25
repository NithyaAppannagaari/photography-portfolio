/// <reference types="vite/client" />

declare module '*.JPG' {
  const src: string
  export default src
}

declare module '*?intrinsic' {
  const size: { width: number; height: number }
  export default size
}
