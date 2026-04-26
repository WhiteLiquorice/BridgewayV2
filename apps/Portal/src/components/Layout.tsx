import PortalLayout from './layouts/PortalLayout'

// The client portal uses a single simple layout: top bar + full-width content.
// No sidebar. No layout theme switching (that's a Dashboard concept).
export default function Layout() {
  return <PortalLayout />
}
