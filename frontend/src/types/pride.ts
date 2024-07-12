export enum PrideVariant {
  STRAIGHT,
  GAY_SUBTLE,
  GAY,
  LESBIAN_SUBTLE,
  LESBIAN,
  BISEXUAL_SUBTLE,
  BISEXUAL,
  TRANSGENDER_SUBTLE,
  TRANSGENDER,
  NON_BINARY_SUBTLE,
  NON_BINARY,
  ASEXUAL_SUBTLE,
  ASEXUAL
}

interface Gradient {
  offset?: number;
  stopColor: string;
}

export namespace PrideVariant {
  export function gradient(variant: PrideVariant): Gradient[] {
    switch (variant) {
      case PrideVariant.STRAIGHT:
        return [];
      case PrideVariant.GAY:
        return [
          { offset: 0, stopColor: "#FD0000" },
          { offset: 0.1666, stopColor: "#FD0000" },
          { offset: 0.1666, stopColor: "#FC8B00" },
          { offset: 0.3332, stopColor: "#FC8B00" },
          { offset: 0.3332, stopColor: "#FEE400" },
          { offset: 0.4998, stopColor: "#FEE400" },
          { offset: 0.4998, stopColor: "#119E0B" },
          { offset: 0.6664, stopColor: "#119E0B" },
          { offset: 0.6664, stopColor: "#0644B2" },
          { offset: 0.833, stopColor: "#0644B2" },
          { offset: 0.833, stopColor: "#C12EDB" },
          { offset: 0.833, stopColor: "#C12EDB" }
        ];
      case PrideVariant.LESBIAN:
        return [
          { offset: 0, stopColor: "#FE218B" },
          { offset: 0.3333, stopColor: "#FE218B" },
          { offset: 0.3333, stopColor: "#FED700" },
          { offset: 0.6666, stopColor: "#FED700" },
          { offset: 0.6666, stopColor: "#21B0FE" },
          { offset: 1, stopColor: "#21B0FE" }
        ];
      case PrideVariant.BISEXUAL:
        return [
          { offset: 0, stopColor: "#D50270" },
          { offset: 0.4, stopColor: "#D50270" },
          { offset: 0.4, stopColor: "#9A4F95" },
          { offset: 0.6, stopColor: "#9A4F95" },
          { offset: 0.6, stopColor: "#0190ea" },
          { offset: 1, stopColor: "#0190ea" }
        ];
      case PrideVariant.TRANSGENDER:
        return [
          { offset: 0, stopColor: "#5BCDF9" },
          { offset: 0.2, stopColor: "#5BCDF9" },
          { offset: 0.2, stopColor: "#F4A8B7" },
          { offset: 0.4, stopColor: "#F4A8B7" },
          { offset: 0.4, stopColor: "#FEFEFE" },
          { offset: 0.6, stopColor: "#FEFEFE" },
          { offset: 0.6, stopColor: "#F4A8B7" },
          { offset: 0.8, stopColor: "#F4A8B7" },
          { offset: 0.8, stopColor: "#5BCDF9" },
          { offset: 1, stopColor: "#5BCDF9" }
        ];
      case PrideVariant.NON_BINARY:
        return [
          { offset: 0, stopColor: "#FEF330" },
          { offset: 0.25, stopColor: "#FEF330" },
          { offset: 0.25, stopColor: "#FEFEFE" },
          { offset: 0.5, stopColor: "#FEFEFE" },
          { offset: 0.5, stopColor: "#9B59D0" },
          { offset: 0.75, stopColor: "#9B59D0" },
          { offset: 0.75, stopColor: "#424242" },
          { offset: 1, stopColor: "#424242" }
        ];
      case PrideVariant.ASEXUAL:
        return [
          { offset: 0, stopColor: "#424242" },
          { offset: 0.25, stopColor: "#424242" },
          { offset: 0.25, stopColor: "#A2A2A2" },
          { offset: 0.5, stopColor: "#A2A2A2" },
          { offset: 0.5, stopColor: "#FEFEFE" },
          { offset: 0.75, stopColor: "#FEFEFE" },
          { offset: 0.75, stopColor: "#aa00aa" },
          { offset: 1, stopColor: "#aa00aa" }
        ];
      case PrideVariant.TRANSGENDER_SUBTLE:
        return [
          { stopColor: "#55CCFB" },
          { stopColor: "#55CCFB" },
          { offset: 0.5, stopColor: "#C7D9F3" },
          { offset: 0.5, stopColor: "#C7D9F3" },
          { offset: 1, stopColor: "#F6A7B7" },
          { offset: 1, stopColor: "#F6A7B7" }
        ];
      case PrideVariant.NON_BINARY_SUBTLE:
        return [
          { stopColor: "#F3EB56" },
          { stopColor: "#F3EB56" },
          { offset: 1, stopColor: "#AF74DF" },
          { offset: 1, stopColor: "#AF74DF" }
        ];
      case PrideVariant.BISEXUAL_SUBTLE:
        return [
          { stopColor: "#F293AB" },
          { stopColor: "#F293AB" },
          { offset: 1, stopColor: "#88A4F5" },
          { offset: 1, stopColor: "#88A4F5" }
        ];
      case PrideVariant.ASEXUAL_SUBTLE:
        return [
          { stopColor: "#424242" },
          { stopColor: "#424242" },
          { offset: 1, stopColor: "#AF74DF" },
          { offset: 1, stopColor: "#AF74DF" }
        ];
      case PrideVariant.GAY_SUBTLE:
        //#ff4e50, #ffd700, #0190ea
        return [
          { stopColor: "#ff4e50" },
          { offset: 0.5, stopColor: "#ffd700" },
          { offset: 1, stopColor: "#0190ea" }
        ];
      case PrideVariant.LESBIAN_SUBTLE:
        return [
          { stopColor: "#d62976" },
          { stopColor: "#d62976" },
          { offset: 1, stopColor: "#0190ea" },
          { offset: 1, stopColor: "#0190ea" }
        ];
      default:
        return [];
    }
  }
}
