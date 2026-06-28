import { HTML2CANVAS_CDN } from './config'

export type Html2CanvasLoadState = 'idle' | 'loading' | 'ready' | 'error'

let loadPromise: Promise<void> | null = null
let state: Html2CanvasLoadState = 'idle'

export function getHtml2CanvasState(): Html2CanvasLoadState {
  return state
}

export async function loadHtml2Canvas(
  onProgress?: (percent: number, message: string) => void,
): Promise<void> {
  if (state === 'ready') return
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    state = 'loading'
    onProgress?.(10, '开始加载 html2canvas...')

    if ((window as any).html2canvas) {
      state = 'ready'
      onProgress?.(100, 'html2canvas 已就绪（复用）')
      return
    }

    onProgress?.(30, '从 CDN 下载 html2canvas (~58KB)...')

    try {
      await loadScript(HTML2CANVAS_CDN)

      if (!(window as any).html2canvas) {
        throw new Error('html2canvas 加载后未找到全局变量')
      }

      state = 'ready'
      onProgress?.(100, 'html2canvas 已就绪')
    } catch (e) {
      state = 'error'
      throw e
    }
  })()

  return loadPromise
}

export function resetHtml2Canvas(): void {
  state = 'idle'
  loadPromise = null
}

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-html2canvas-src="${url}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = url
    script.dataset.html2canvasSrc = url
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`脚本加载失败: ${url}`))
    document.head.appendChild(script)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getHtml2Canvas(): any {
  return (window as any).html2canvas
}
