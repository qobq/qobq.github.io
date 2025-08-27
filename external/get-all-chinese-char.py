import os
import re
from pathlib import Path

p = ".."

# Find all CSV and JS files
files = list(Path(p).rglob("*.csv")) + list(Path(p).rglob("*.js"))

# Extract Chinese characters
chinese_chars = set()
for file in files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            chars = re.findall(r'[\u4e00-\u9fff]', content)
            chinese_chars.update(chars)
    except:
        try:
            with open(file, 'r', encoding='gbk') as f:
                content = f.read()
                chars = re.findall(r'[\u4e00-\u9fff]', content)
                chinese_chars.update(chars)
        except:
            continue

# Save to file
with open('chinese-charset-game.txt', 'w', encoding='utf-8') as f:
    f.write(''.join(sorted(chinese_chars)))

print(f"Saved {len(chinese_chars)} Chinese characters to chinese-charset-game.txt")