// Generate heading anchors during rendering so Pagefind and the reader's TOC
// see the same IDs, including repeated headings.
export function rehypeSearchAnchors() {
  return tree => {
    const used = new Set();
    function collect(node) {
      if (node.properties?.id) used.add(String(node.properties.id));
      node.children?.forEach(collect);
    }
    function text(node) {
      return node.value ?? node.children?.map(text).join('') ?? '';
    }
    function visit(node) {
      if (/^h[1-6]$/.test(node.tagName) && !node.properties?.id) {
        const base = text(node).toLowerCase().replace(/\s+/g, '-')
          .replace(/[^\w\u4e00-\u9fa5-]/g, '').slice(0, 50) || 'heading';
        let id = base;
        for (let suffix = 2; used.has(id); suffix++) id = `${base}-${suffix}`;
        used.add(id);
        node.properties = { ...node.properties, id };
      }
      node.children?.forEach(visit);
    }
    collect(tree);
    visit(tree);
  };
}
