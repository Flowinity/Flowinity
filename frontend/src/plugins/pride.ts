import { useExperimentsStore } from "@/store/experiments.store";

export enum PrideVariant {
  STRAIGHT,
  GAY,
  LESBIAN,
  BISEXUAL,
  TRANSGENDER,
  NON_BINARY,
  ASEXUAL
}

export const usePride = () => {
  const experimentsStore = useExperimentsStore();
  const variant = experimentsStore.experiments.PRIDE;
  switch (variant) {
    case PrideVariant.STRAIGHT:
      return "";
    case PrideVariant.GAY:
      return `
<linearGradient id="pride_gradient" x1="-146.005" y1="354.015" x2="90.0049" y2="590.024" gradientUnits="userSpaceOnUse">
<stop stop-color="#FD0000"/>
<stop offset="0.1666" stop-color="#FD0000"/>
<stop offset="0.1666" stop-color="#FC8B00"/>
<stop offset="0.3332" stop-color="#FC8B00"/>
<stop offset="0.3332" stop-color="#FEE400"/>
<stop offset="0.4998" stop-color="#FEE400"/>
<stop offset="0.4998" stop-color="#119E0B"/>
<stop offset="0.6664" stop-color="#119E0B"/>
<stop offset="0.6664" stop-color="#0644B2"/>
<stop offset="0.833" stop-color="#0644B2"/>
<stop offset="0.833" stop-color="#C12EDB"/>
<stop offset="1" stop-color="#C12EDB"/>
</linearGradient>
`;
    case PrideVariant.LESBIAN:
      return `  <linearGradient id="pride_gradient" x1="-146.005" y1="354.015" x2="90.0049" y2="590.024" gradientUnits="userSpaceOnUse">
<stop stop-color="#FE218B"/>
<stop offset="0.3333" stop-color="#FE218B"/>
<stop offset="0.3333" stop-color="#FED700"/>
<stop offset="0.6666" stop-color="#FED700"/>
<stop offset="0.6666" stop-color="#21B0FE"/>
<stop offset="1" stop-color="#21B0FE"/>
  </linearGradient>`;
    case PrideVariant.BISEXUAL:
      return `<linearGradient id="pride_gradient" x1="-146.005" y1="354.015" x2="90.0049" y2="590.024" gradientUnits="userSpaceOnUse">
<stop stop-color="#D50270"/>
<stop offset="0.4" stop-color="#D50270"/>
<stop offset="0.4" stop-color="#9A4F95"/>
<stop offset="0.6" stop-color="#9A4F95"/>
<stop offset="0.6" stop-color="#0038A7"/>
<stop offset="1" stop-color="#0038A7"/>
  </linearGradient>`;
    case PrideVariant.TRANSGENDER:
      return `<linearGradient id="pride_gradient" x1="-146.005" y1="354.015" x2="90.0049" y2="590.024" gradientUnits="userSpaceOnUse">
<stop stop-color="#5BCDF9"/>
<stop offset="0.2" stop-color="#5BCDF9"/>
<stop offset="0.2" stop-color="#F4A8B7"/>
<stop offset="0.4" stop-color="#F4A8B7"/>
<stop offset="0.4" stop-color="#FEFEFE"/>
<stop offset="0.6" stop-color="#FEFEFE"/>
<stop offset="0.6" stop-color="#F4A8B7"/>
<stop offset="0.8" stop-color="#F4A8B7"/>
<stop offset="0.8" stop-color="#5BCDF9"/>
<stop offset="1" stop-color="#5BCDF9"/>
</linearGradient>`;
    case PrideVariant.NON_BINARY:
      return `<linearGradient id="pride_gradient" x1="-146.005" y1="354.015" x2="90.0049" y2="590.024" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEF330"/>
<stop offset="0.25" stop-color="#FEF330"/>
<stop offset="0.25" stop-color="#FEFEFE"/>
<stop offset="0.5" stop-color="#FEFEFE"/>
<stop offset="0.5" stop-color="#9B59D0"/>
<stop offset="0.75" stop-color="#9B59D0"/>
<stop offset="0.75" stop-color="#181818"/>
<stop offset="1" stop-color="#181818"/>
</linearGradient>`;
    case PrideVariant.ASEXUAL:
      return `<linearGradient id="pride_gradient" x1="-146.005" y1="354.015" x2="90.0049" y2="590.024" gradientUnits="userSpaceOnUse">
<stop stop-color="#181818"/>
<stop offset="0.25" stop-color="#181818"/>
<stop offset="0.25" stop-color="#A2A2A2"/>
<stop offset="0.5" stop-color="#A2A2A2"/>
<stop offset="0.5" stop-color="#FEFEFE"/>
<stop offset="0.75" stop-color="#FEFEFE"/>
<stop offset="0.75" stop-color="#800080"/>
<stop offset="1" stop-color="#800080"/>
</linearGradient>`;
    default:
      return "";
  }
};
