/**
 * Like Lit's `@customElement`, but skips registration when the tag already exists.
 * Both published bundles inline core, so pages that load dictation and ambient
 * must not throw on duplicate registry entries.
 */
export function safeCustomElement(tag: string) {
  return <T extends CustomElementConstructor>(
    classOrTarget: T,
    context?: ClassDecoratorContext<T>,
  ): T => {
    if (customElements.get(tag)) {
      return classOrTarget;
    }

    if (context !== undefined) {
      context.addInitializer(() => {
        if (!customElements.get(tag)) {
          customElements.define(tag, classOrTarget);
        }
      });
      return classOrTarget;
    }

    customElements.define(tag, classOrTarget);
    return classOrTarget;
  };
}
