import os
import sys
import subprocess
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options
import brotli

def install_package(package):
    """Install required Python package"""
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def check_dependencies():
    """Check and install required dependencies"""
    try:
        from fontTools.ttLib import TTFont
    except ImportError:
        print("Installing fonttools...")
        install_package("fonttools")
    
    try:
        import brotli
    except ImportError:
        print("Installing brotli...")
        install_package("brotli")

def read_chinese_charset(filename):
    """Read Chinese character set from file"""
    if not os.path.exists(filename):
        raise FileNotFoundError(f"Character set file {filename} does not exist")
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    charset = set(content)
    print(f"Read {len(charset)} unique characters from {filename}")
    return charset

def create_subset_font(input_font, output_font, charset):
    """Create font subset with specified characters"""
    if not os.path.exists(input_font):
        raise FileNotFoundError(f"Font file {input_font} does not exist")
    
    print(f"Loading font: {input_font}")
    font = TTFont(input_font)
    
    original_glyphs = len(font.getGlyphOrder())
    print(f"Original font contains {original_glyphs} glyphs")
    
    all_chars = set()
    
    # Add ASCII characters (32-126)
    ascii_chars = set(chr(i) for i in range(32, 127))
    all_chars.update(ascii_chars)
    print(f"Added {len(ascii_chars)} ASCII characters")
    
    # Add Chinese characters
    all_chars.update(charset)
    print(f"Total character set size: {len(all_chars)} characters")
    
    text = ''.join(all_chars)
    
    # Configure subset options - be more conservative for web compatibility
    options = Options()
    options.with_recommendations = False
    options.desubroutinize = True
    options.hinting = False  # Remove hinting for smaller size
    options.legacy_kern = False
    
    # Keep essential metadata for web compatibility
    options.name_IDs = [1, 2, 3, 4, 6]  # Keep essential name records
    options.name_legacy = True
    options.name_languages = [0x409]  # English-US
    
    # Create font subset
    subsetter = Subsetter(options=options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    
    # Save subset font
    font.save(output_font)
    
    # Verify results
    subset_font = TTFont(output_font)
    subset_glyphs = len(subset_font.getGlyphOrder())
    print(f"Subset font contains {subset_glyphs} glyphs")
    print(f"Reduction rate: {((original_glyphs - subset_glyphs) / original_glyphs * 100):.1f}%")
    
    subset_font.close()
    font.close()
    
    return output_font

def compress_to_woff2(input_font, output_woff2):
    """Compress TTF font to WOFF2 format with web compatibility"""
    if not os.path.exists(input_font):
        raise FileNotFoundError(f"Input font {input_font} does not exist")
    
    print(f"Compressing {input_font} to WOFF2 format")
    
    # Load the font with proper metadata preservation
    font = TTFont(input_font)
    
    # Ensure essential tables are preserved for web compatibility
    essential_tables = ['cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'post', 'OS/2']
    
    # Remove only non-essential tables that won't break web compatibility
    tables_to_remove = ['DSIG', 'GDEF', 'GPOS', 'GSUB', 'vhea', 'vmtx']
    
    for table in tables_to_remove:
        if table in font and table not in essential_tables:
            del font[table]
            print(f"Removed non-essential table: {table}")
    
    # Set WOFF2 flavor and save
    font.flavor = "woff2"
    font.save(output_woff2)
    font.close()
    
    print(f"WOFF2 compression completed: {output_woff2}")
    return output_woff2

def verify_woff2_compatibility(woff2_file):
    """Verify that the WOFF2 file is web compatible"""
    if not os.path.exists(woff2_file):
        raise FileNotFoundError(f"WOFF2 file {woff2_file} does not exist")
    
    try:
        # Try to load the WOFF2 file to verify compatibility
        font = TTFont(woff2_file)
        
        # Check essential tables
        essential_tables = ['cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'post']
        missing_tables = []
        
        for table in essential_tables:
            if table not in font:
                missing_tables.append(table)
        
        if missing_tables:
            print(f"Warning: Missing essential tables: {missing_tables}")
        else:
            print("WOFF2 file contains all essential tables for web use")
        
        font.close()
        return len(missing_tables) == 0
        
    except Exception as e:
        print(f"Error verifying WOFF2 file: {e}")
        return False

def get_file_size(filename):
    """Get file size in bytes"""
    size = os.path.getsize(filename)
    return size

def format_file_size(size_bytes):
    """Format file size for human readable output"""
    if size_bytes >= 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.2f} MB"
    elif size_bytes >= 1024:
        return f"{size_bytes / 1024:.2f} KB"
    else:
        return f"{size_bytes} bytes"

def generate_css_example(woff2_file):
    """Generate CSS code example for using the font"""
    css_template = f"""
@font-face {{
    font-family: 'MapleMono-NF-CN';
    src: url('{woff2_file}') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}}

body {{
    font-family: 'MapleMono-NF-CN', monospace;
}}
"""
    print("\nCSS usage example:")
    print(css_template)

def main():
    """Main function to process font subsetting and compression"""
    input_font = "MapleMono-NF-CN-Regular.ttf"
    charset_file = "chinese-charset-game.txt"
    subset_font = "MapleMono-NF-CN-Regular-Sub.ttf"
    output_woff2 = "../resource/font/MapleMono-NF-CN-Regular.woff2"
    
    # Check dependencies
    check_dependencies()
    
    # Read character set
    charset = read_chinese_charset(charset_file)
    
    # Create font subset
    print("\nCreating font subset...")
    subset_file = create_subset_font(input_font, subset_font, charset)
    subset_size = get_file_size(subset_file)
    print(f"Subset font size: {format_file_size(subset_size)}")
    
    # Compress to WOFF2 with web compatibility
    print("\nCompressing to WOFF2 format with web compatibility...")
    woff2_file = compress_to_woff2(subset_file, output_woff2)
    woff2_size = get_file_size(woff2_file)
    print(f"WOFF2 size: {format_file_size(woff2_size)}")
    
    # Verify web compatibility
    print("\nVerifying web compatibility...")
    is_compatible = verify_woff2_compatibility(woff2_file)
    
    if is_compatible:
        print("✓ WOFF2 file is web compatible")
    else:
        print("⚠ WOFF2 file may have compatibility issues")
    
    # Clean up temporary files
    if os.path.exists(subset_font):
        os.remove(subset_font)
        print(f"Removed temporary file: {subset_font}")
    
    # Display final results
    original_size = get_file_size(input_font)
    compression_ratio = (woff2_size / original_size) * 100
    
    print(f"\nFinal results:")
    print(f"Original font: {format_file_size(original_size)}")
    print(f"Compressed WOFF2: {format_file_size(woff2_size)}")
    print(f"Compression ratio: {compression_ratio:.1f}%")
    print(f"Output file: {output_woff2}")
    
    # Generate CSS example
    generate_css_example(output_woff2)

if __name__ == "__main__":
    main()