// performanceManager.js — Automatic Level-of-Detail based on node count

/**
 * Build one shared SpriteMaterial per color for sprite mode.
 * Returns a Map<color_hex, THREE.SpriteMaterial>.
 */
function buildSpriteMaterials(THREE, colors) {
  const map = new Map();
  for (const color of Object.values(colors)) {
    if (map.has(color)) continue;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    map.set(color, new THREE.SpriteMaterial({ map: tex, transparent: true }));
  }
  return map;
}

/**
 * Configure 3d-force-graph instance for the given node count.
 *
 * @param {Object} Graph       - ForceGraph3D instance
 * @param {Object} THREE       - THREE namespace (window.THREE)
 * @param {number} nodeCount   - total number of graph nodes
 * @param {Object} termColors  - TERMINATOR_COLORS map (color_hex per type)
 * @param {Function} getColor  - fn(node) → color string
 * @param {Function} getSize   - fn(node) → number
 */
export function applyPerformanceProfile(Graph, THREE, nodeCount, termColors, getColor, getSize) {
  // Always: stop simulation after 5 s, pre-warm 50 ticks
  Graph.cooldownTime(5000).warmupTicks(50);

  // THREE may be undefined if CDN failed to load; guard all sprite usage
  const hasThree = THREE != null;

  if (nodeCount > 5000) {
    // Massive: sprite-based nodes (shared textures) + aggressive physics
    if (hasThree) {
      const materials = buildSpriteMaterials(THREE, termColors);
      Graph
        .nodeThreeObjectExtend(false)
        .nodeThreeObject(node => {
          const color = getColor(node);
          const mat = materials.get(color) ?? materials.values().next().value;
          const sprite = new THREE.Sprite(mat);
          const s = getSize(node) * 1.5;
          sprite.scale.set(s, s, 1);
          return sprite;
        });
    } else {
      // No THREE available — use library default (still renders, just no custom sprites)
      Graph.nodeThreeObject(null);
    }
    Graph
      .linkDirectionalArrowLength(0)
      .linkWidth(0.3)
      .d3AlphaDecay(0.05)
      .d3VelocityDecay(0.4)
      .warmupTicks(100);

  } else if (nodeCount > 1000) {
    // Medium: sprite-based nodes (shared textures = much cheaper than geometry)
    if (hasThree) {
      const materials = buildSpriteMaterials(THREE, termColors);
      Graph
        .nodeThreeObjectExtend(false)
        .nodeThreeObject(node => {
          const color = getColor(node);
          const mat = materials.get(color) ?? materials.values().next().value;
          const sprite = new THREE.Sprite(mat);
          const s = getSize(node) * 2;
          sprite.scale.set(s, s, 1);
          return sprite;
        });
    } else {
      Graph.nodeThreeObject(null);
    }
    Graph
      .linkDirectionalArrowLength(2)
      .linkWidth(link => link.type === 'fallthrough' ? 0.4 : 1.2);

  } else {
    // Small: full sphere geometry, labels on hover handled by default nodeLabel
    Graph
      .nodeThreeObject(null)
      .linkDirectionalArrowLength(3.5)
      .linkDirectionalArrowRelPos(1)
      .linkWidth(link => link.type === 'fallthrough' ? 0.5 : 1.5);
  }
}
