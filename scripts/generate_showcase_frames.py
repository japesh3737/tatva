import os
import cv2
from concurrent.futures import ProcessPoolExecutor
import time

INPUT_VIDEO = "public/tatva-showcase.mp4"
OUTPUT_DIR = "public/showcase-frames"
WEBP_QUALITY = 82

def save_frame(args):
    idx, frame, out_path = args
    cv2.imwrite(out_path, frame, [cv2.IMWRITE_WEBP_QUALITY, WEBP_QUALITY])
    return idx

def main():
    t0 = time.time()
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    cap = cv2.VideoCapture(INPUT_VIDEO)
    if not cap.isOpened():
        print(f"Error opening {INPUT_VIDEO}")
        return

    frames = []
    idx = 0
    tasks = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        out_path = os.path.join(OUTPUT_DIR, f"frame_{idx:04d}.webp")
        tasks.append((idx, frame, out_path))
        idx += 1
    cap.release()

    total = len(tasks)
    print(f"Read {total} frames from {INPUT_VIDEO}. Encoding as WebP...")

    max_workers = min(os.cpu_count() or 4, 16)
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        for done_idx in executor.map(save_frame, tasks):
            if done_idx % 50 == 0:
                print(f"Encoded frame {done_idx}/{total}...")

    elapsed = time.time() - t0
    print(f"Successfully exported {total} frames into {OUTPUT_DIR}/ in {elapsed:.2f}s")

if __name__ == "__main__":
    main()
