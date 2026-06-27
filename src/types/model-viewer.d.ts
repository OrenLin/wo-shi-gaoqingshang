// Type declarations for @google/model-viewer Web Component
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        'camera-controls'?: boolean | string;
        'touch-action'?: string;
        'auto-rotate'?: boolean | string;
        'shadow-intensity'?: string | number;
        'shadow-softness'?: string | number;
        'exposure'?: string | number;
        'environment-image'?: string;
        'skybox-image'?: string;
        'camera-orbit'?: string;
        'camera-target'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'auto-rotate-delay'?: string | number;
        'rotation-per-second'?: string;
        'interaction-prompt'?: string;
        'interaction-policy'?: string;
        'loading'?: string;
        'reveal'?: string;
        'ar'?: boolean | string;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'ar-placement'?: string;
        iosSrc?: string;
        'ios-src'?: string;
        'quick-look-browsers'?: string;
        'animation-name'?: string;
        'animation-crossfade'?: string | number;
        autoplay?: boolean | string;
      },
      HTMLElement
    >;
  }
}
