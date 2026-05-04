export function renderIntoTargets(targets, className, buildNodes) {
  targets.forEach((target) => {
    if (!target) {
      return;
    }

    if (target.className !== className) {
      target.className = className;
    }

    const newNodes = buildNodes();
    reconcile(target, newNodes);
  });
}

/**
 * Basic DOM reconciliation that matches nodes by data-id.
 * It preserves existing nodes to maintain state (focus, scroll, etc.)
 * and only updates nodes that have changed.
 */
function reconcile(parent, newNodes) {
  const currentNodes = Array.from(parent.children);
  const currentById = new Map();

  currentNodes.forEach((node) => {
    if (node.dataset.id) {
      currentById.set(node.dataset.id, node);
    }
  });

  // 1. Remove nodes that are no longer present
  const newNodeIds = new Set(newNodes.map((n) => n.dataset.id).filter(Boolean));
  currentNodes.forEach((node) => {
    if (node.dataset.id && !newNodeIds.has(node.dataset.id)) {
      parent.removeChild(node);
    }
  });

  // 2. Add or update nodes in order
  newNodes.forEach((newNode, index) => {
    const id = newNode.dataset.id;
    const existing = id ? currentById.get(id) : null;
    const currentAtIndex = parent.children[index];

    if (existing) {
      // If it's the same node but in wrong position, move it
      if (existing !== currentAtIndex) {
        parent.insertBefore(existing, currentAtIndex);
      }
      // Patch content if it changed. Note: outerHTML comparison is a 
      // simple way to detect changes in static components.
      if (existing.outerHTML !== newNode.outerHTML) {
        parent.replaceChild(newNode, existing);
      }
    } else {
      // New node or node without ID
      parent.insertBefore(newNode, currentAtIndex || null);
    }
  });

  // 3. Cleanup any trailing nodes (for nodes without IDs that might be left)
  while (parent.children.length > newNodes.length) {
    parent.removeChild(parent.lastChild);
  }
}
