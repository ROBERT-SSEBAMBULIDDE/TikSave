// This is just a placeholder component to maintain backward compatibility
// All ad-related functionality has been removed per user request

type AdPlacementLocation = 'header' | 'footer' | 'sidebar' | 'inline' | 'content-top' | 'content-bottom';

interface AdPlacementProps {
  location: AdPlacementLocation;
  className?: string;
  style?: React.CSSProperties;
}

export function AdPlacement({ location, className = '', style = {} }: AdPlacementProps) {
  // Return empty fragment since we've removed all ad functionality
  return <></>;
}