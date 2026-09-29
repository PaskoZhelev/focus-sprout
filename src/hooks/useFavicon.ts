import { useEffect } from 'react'

/** Swaps the tab icon for one with a dot, to flag that something is waiting for the user. */
export function useFavicon(alert: boolean): void {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) return
    link.href = new URL(alert ? 'favicon-alert.svg' : 'favicon.svg', document.baseURI).href
  }, [alert])
}
