type CustomElementClass = CustomElementConstructor & {
  new (...args: unknown[]): HTMLElement;
};

/** Registers the class under both `dictation-*` and `ambient-*` tag names. */
export const dualCustomElement =
  (dictationTag: string, ambientTag: string) =>
  <T extends CustomElementClass>(target: T): T => {
    if (!customElements.get(dictationTag)) {
      customElements.define(dictationTag, target);
    }

    if (!customElements.get(ambientTag)) {
      customElements.define(ambientTag, target);
    }

    return target;
  };
