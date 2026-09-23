import os
import cv2
import numpy as np
from concurrent.futures import ProcessPoolExecutor
import time

INPUT_VIDEO = "public/tatva-hero-interior.mp4"
OUTPUT_DIR = "public/interior-frames"
WEBP_QUALITY = 82

def interpolate_pair(args):
    idx, f1, f2, out_path_orig, out_path_interp = args
    
    # 1. Save original frame as WebP
    cv2.imwrite(out_path_orig, f1, [cv2.IMWRITE_WEBP_QUALITY, WEBP_QUALITY])
    
    # 2. If no second frame (last frame), nothing to interpolate
    if f2 is None or out_path_interp is None:
        return idx, 1

    # 3. DIS optical flow bidirectional interpolation
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_FAST)
    g1 = cv2.cvtColor(f1, cv2.COLOR_BGR2GRAY)
    g2 = cv2.cvtColor(f2, cv2.COLOR_BGR2GRAY)
    
    flow_fwd = dis.calc(g1, g2, None)
    flow_bwd = dis.calc(g2, g1, None)
    
    h, w = f1.shape[:2]
    grid_x, grid_y = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    
    map1_x = grid_x + flow_fwd[..., 0] * 0.5
    map1_y = grid_y + flow_fwd[..., 1] * 0.5
    warp1 = cv2.remap(f1, map1_x, map1_y, cv2.INTER_LINEAR)
    
    map2_x = grid_x + flow_bwd[..., 0] * 0.5
    map2_y = grid_y + flow_bwd[..., 1] * 0.5
    warp2 = cv2.remap(f2, map2_x, map2_y, cv2.INTER_LINEAR)
    
    interp = cv2.addWeighted(warp1, 0.5, warp2, 0.5, 0)
    cv2.imwrite(out_path_interp, interp, [cv2.IMWRITE_WEBP_QUALITY, WEBP_QUALITY])
    
    return idx, 2

def main():
    t0 = time.time()
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    cap = cv2.VideoCapture(INPUT_VIDEO)
    if not cap.isOpened():
        print(f"Error: could not open {INPUT_VIDEO}")
        return
        
    raw_frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        raw_frames.append(frame)
    cap.release()
    
    total_raw = len(raw_frames)
    print(f"Loaded {total_raw} raw frames from {INPUT_VIDEO}")
    
    tasks = []
    total_out_frames = 0
    for i in range(total_raw):
        orig_out_idx = i * 2
        orig_path = os.path.join(OUTPUT_DIR, f"frame_{orig_out_idx:04d}.webp")
        
        if i < total_raw - 1:
            interp_out_idx = orig_out_idx + 1
            interp_path = os.path.join(OUTPUT_DIR, f"frame_{interp_out_idx:04d}.webp")
            tasks.append((i, raw_frames[i], raw_frames[i + 1], orig_path, interp_path))
            total_out_frames += 2
        else:
            tasks.append((i, raw_frames[i], None, orig_path, None))
            total_out_frames += 1
            
    print(f"Scheduled {len(tasks)} tasks generating {total_out_frames} total frames...")
    
    max_workers = min(os.cpu_count() or 4, 16)
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        for idx, count in executor.map(interpolate_pair, tasks):
            if idx % 30 == 0:
                print(f"Processed up to raw frame {idx}/{total_raw}...")
                
    elapsed = time.time() - t0
    print(f"Successfully generated {total_out_frames} frames in {elapsed:.2f}s into {OUTPUT_DIR}/")

if __name__ == "__main__":
    main()
