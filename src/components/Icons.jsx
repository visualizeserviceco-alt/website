/**
 * Visualize icon set – minimal stroke, Streamline-inspired.
 * Use one consistent style; 16–28px; brand accent where applied.
 */
const stroke = 1.5;
const viewBox = '0 0 24 24';
const baseSvgProps = { fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };

function IconWrap({ size = 24, className, ...rest }) {
  return <svg width={size} height={size} viewBox={viewBox} className={className} {...baseSvgProps} {...rest} />;
}

export function IconPenTool(props) {
  return (
    <IconWrap {...props}>
      <path d="M12 19l3-3-5-5-3 3" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    </IconWrap>
  );
}

export function IconLogoMark(props) {
  return (
    <IconWrap {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </IconWrap>
  );
}

export function IconLayers(props) {
  return (
    <IconWrap {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
    </IconWrap>
  );
}

export function IconBrowser(props) {
  return (
    <IconWrap {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M2 8h20" />
    </IconWrap>
  );
}

export function IconLayoutSingle(props) {
  return (
    <IconWrap {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </IconWrap>
  );
}

export function IconSticker(props) {
  return (
    <IconWrap {...props}>
      <path d="M12 22c2.5 0 5-1.5 6.5-3.5.5-.8.5-1.8 0-2.5L14 8.5c-.7-.5-1.7-.5-2.5 0C9.5 10 8 12.5 8 15s1.5 5 4 7z" />
    </IconWrap>
  );
}

export function IconCard(props) {
  return (
    <IconWrap {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </IconWrap>
  );
}

export function IconMapPin(props) {
  return (
    <IconWrap {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </IconWrap>
  );
}

export function IconRocket(props) {
  return (
    <IconWrap {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012.5-3.5C12.5 6.5 14 5 16 4c0 2 1.5 3.5 3 4.5a22 22 0 01-3.5 2.5z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </IconWrap>
  );
}

export function IconGrid(props) {
  return (
    <IconWrap {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </IconWrap>
  );
}

export function IconBrandMark(props) {
  return (
    <IconWrap {...props}>
      <path d="M12 3l7 4v8l-7 4-7-4V7l7-4z" />
    </IconWrap>
  );
}

export function IconChat(props) {
  return (
    <IconWrap {...props}>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </IconWrap>
  );
}

export function IconPencilRuler(props) {
  return (
    <IconWrap {...props}>
      <path d="M15 5l4 4" />
      <path d="M13 7L8.7 11.3a2 2 0 00-.5.8L8 14l1.9.2a2 2 0 00.8-.5L17 11" />
      <path d="M12 19H5a2 2 0 01-2-2V7a2 2 0 012-2h3" />
      <path d="M19 15v4M19 11v.01" />
    </IconWrap>
  );
}

export function IconRefresh(props) {
  return (
    <IconWrap {...props}>
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </IconWrap>
  );
}

export function IconCheckCircle(props) {
  return (
    <IconWrap {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </IconWrap>
  );
}

export function IconArrowRight(props) {
  return (
    <IconWrap {...props}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </IconWrap>
  );
}

export function IconExternal(props) {
  return (
    <IconWrap {...props}>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </IconWrap>
  );
}
