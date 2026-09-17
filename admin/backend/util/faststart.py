#!/usr/bin/env python3
import struct
import os
import sys

def convert_to_faststart(in_path, out_path=None):
    if out_path is None:
        out_path = in_path + ".tmp.mp4"
        in_place = True
    else:
        in_place = False

    try:
        with open(in_path, "rb") as f:
            data = f.read()

        idx = 0
        atoms = []
        while idx < len(data):
            if idx + 8 > len(data):
                break
            size, name = struct.unpack(">I4s", data[idx:idx+8])
            if size == 1:
                size = struct.unpack(">Q", data[idx+8:idx+16])[0]
                header_len = 16
            elif size == 0:
                size = len(data) - idx
                header_len = 8
            else:
                header_len = 8
            atoms.append((name, idx, size, header_len))
            idx += size

        ftyp = next((a for a in atoms if a[0] == b"ftyp"), None)
        moov = next((a for a in atoms if a[0] == b"moov"), None)
        mdat = next((a for a in atoms if a[0] == b"mdat"), None)

        if not moov or not mdat:
            print(f"[{in_path}] Missing moov or mdat box.")
            return False

        if moov[1] < mdat[1]:
            print(f"[{in_path}] Already optimized for streaming (moov before mdat).")
            return True

        moov_data = bytearray(data[moov[1]:moov[1]+moov[2]])
        moov_len = len(moov_data)

        # Patch stco / co64 tables inside moov so chunk offsets are shifted by moov_len
        p = 0
        while p < len(moov_data) - 8:
            atom_size, atom_name = struct.unpack(">I4s", moov_data[p:p+8])
            if atom_name == b"stco":
                count = struct.unpack(">I", moov_data[p+12:p+16])[0]
                for i in range(count):
                    offset_pos = p + 16 + i * 4
                    if offset_pos + 4 <= len(moov_data):
                        old_val = struct.unpack(">I", moov_data[offset_pos:offset_pos+4])[0]
                        struct.pack_into(">I", moov_data, offset_pos, old_val + moov_len)
                p += atom_size if atom_size > 0 else 8
            elif atom_name == b"co64":
                count = struct.unpack(">I", moov_data[p+12:p+16])[0]
                for i in range(count):
                    offset_pos = p + 16 + i * 8
                    if offset_pos + 8 <= len(moov_data):
                        old_val = struct.unpack(">Q", moov_data[offset_pos:offset_pos+8])[0]
                        struct.pack_into(">Q", moov_data, offset_pos, old_val + moov_len)
                p += atom_size if atom_size > 0 else 8
            else:
                p += 1

        with open(out_path, "wb") as out:
            if ftyp:
                out.write(data[ftyp[1]:ftyp[1]+ftyp[2]])
            out.write(moov_data)
            for a in atoms:
                if a[0] not in (b"ftyp", b"moov"):
                    out.write(data[a[1]:a[1]+a[2]])

        if in_place:
            os.replace(out_path, in_path)

        print(f"[{in_path}] Faststart applied successfully! (moov moved to top, {moov_len} bytes)")
        return True
    except Exception as e:
        print(f"[{in_path}] Faststart error: {e}")
        if in_place and os.path.exists(out_path):
            os.remove(out_path)
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        for p in sys.argv[1:]:
            if os.path.isfile(p):
                convert_to_faststart(p)
    else:
        print("Usage: faststart.py <file1.mp4> [file2.mp4 ...]")
