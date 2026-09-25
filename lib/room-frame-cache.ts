/** Load nearby room frames on demand; release decoded GPU memory explicitly. */
export function createRoomFrameCache(onReady: () => void) {
  const decoded = new Map<number, ImageBitmap>();
  const compressed = new Map<number, Promise<Blob>>();
  const decoding = new Set<number>();
  const failed = new Set<number>();
  const controller = new AbortController();
  let center = 0;
  let direction = 1;
  let active = false;
  let disposed = false;
  const capacity = 16;

  const fetchFrame = (index: number) => {
    const existing = compressed.get(index);
    if (existing) return existing;
    const request = fetch(`/room-hd-frames/frame_${String(index).padStart(4, "0")}.webp`, {
      signal: controller.signal,
    }).then((response) => {
      if (!response.ok) throw new Error(`Frame ${index}: ${response.status}`);
      return response.blob();
    });
    compressed.set(index, request);
    // Retain a bounded nearby working set of compressed data.
    for (const key of compressed.keys()) {
      if (compressed.size <= 80) break;
      if (decoding.has(key) || key === index) continue;
      compressed.delete(key);
    }
    return request;
  };

  const pump = () => {
    if (disposed) return;
    const wanted = [center];
    if (active) {
      // Bias ahead of travel while retaining a few frames for quick reversals.
      for (let step = 1; step <= 10; step++) {
        wanted.push(center + step * direction);
        if (step <= 3) wanted.push(center - step * direction);
      }
    }
    for (const index of wanted) {
      if (decoding.size >= 3) break;
      if (index < 0 || index >= 480 || decoded.has(index) || decoding.has(index) || failed.has(index)) continue;
      decoding.add(index);
      void fetchFrame(index).then((blob) => createImageBitmap(blob)).then((bitmap) => {
        if (disposed) { bitmap.close(); return; }
        decoded.set(index, bitmap);
        // Keep the current frame and requested look-ahead window first.
        const nextWanted = new Set<number>([center]);
        for (let step = 1; step <= 10; step++) {
          nextWanted.add(center + step * direction);
          if (step <= 3) nextWanted.add(center - step * direction);
        }
        const oldest = [...decoded.keys()].sort((a, b) =>
          Number(nextWanted.has(a)) - Number(nextWanted.has(b)) || Math.abs(b - center) - Math.abs(a - center));
        while (decoded.size > capacity) {
          const key = oldest.shift()!;
          decoded.get(key)!.close();
          decoded.delete(key);
        }
        onReady();
      }).catch(() => {
        if (!disposed) failed.add(index);
        compressed.delete(index);
      }).finally(() => {
        decoding.delete(index);
        pump();
      });
    }
  };

  return {
    get(index: number, lookAhead: boolean) {
      if (index !== center) direction = Math.sign(index - center);
      center = index;
      active = lookAhead;
      pump();
      return decoded.get(index);
    },
    dispose() {
      disposed = true;
      controller.abort();
      decoded.forEach((bitmap) => bitmap.close());
      decoded.clear();
      compressed.clear();
    },
  };
}
