import os

riv_path = os.path.join("assets", "rive", "inappgame.riv")
with open(riv_path, "rb") as f:
    data = f.read()

search_words = [b"Groot", b"Stark", b"Thor", b"Avenger", b"LATIHAN", b"Isi bagian"]

print("--- SEARCH RESULTS ---")
for word in search_words:
    idx = 0
    while True:
        idx = data.find(word, idx)
        if idx == -1:
            break
        print(f"Found '{word.decode()}' at byte offset {idx}")
        # Print surrounding bytes as ASCII strings
        start = max(0, idx - 100)
        end = min(len(data), idx + 100)
        surrounding = data[start:end]
        
        # Filter for printable ASCII
        printable = ""
        for b in surrounding:
            if 32 <= b <= 126:
                printable += chr(b)
            else:
                printable += "."
        print(f"  Surrounding: {printable}")
        idx += len(word)
