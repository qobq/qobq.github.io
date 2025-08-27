import os
import subprocess
import sys
from pathlib import Path
from PIL import Image

def compress_png_with_pillow(input_path, output_path, quality=20):
    """
    Compress PNG image using Pillow library
    
    Args:
        input_path: Path to input PNG file
        output_path: Path for output compressed file
        quality: Compression quality (1-100, lower = more compression)
    
    Returns:
        bool: True if compression successful, False otherwise
    """
    try:
        img = Image.open(input_path)
        img.save(output_path, "PNG", optimize=True, quality=quality)
        return True
    except Exception as e:
        print(f"Pillow compression failed for {input_path}: {e}")
        return False

def compress_png_with_pngquant(input_path, output_path, quality="65-80", speed="1"):
    """
    Compress PNG image using pngquant tool (requires pngquant installation)
    
    Args:
        input_path: Path to input PNG file
        output_path: Path for output compressed file
        quality: Quality range string (e.g., "65-80")
    
    Returns:
        bool: True if compression successful, False otherwise
    """
    try:
        # Compress using pngquant
        cmd = [
            "pngquant",
            "--speed", speed,
            "--quality", quality,
            "--force",
            "--output", output_path,
            input_path
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"pngquant compression failed for {input_path}: {e}")
        return False

def get_file_size(file_path):
    """
    Get file size in kilobytes
    
    Args:
        file_path: Path to the file
    
    Returns:
        float: File size in KB
    """
    return os.path.getsize(file_path) / 1024

def find_and_compress_png_files(directory, method="pngquant", quality=None, backup=True):
    """
    Find and compress all PNG files in the specified directory
    
    Args:
        directory: Directory path to search for PNG files
        method: Compression method ("pillow" or "pngquant")
        quality: Quality parameter (for pillow: 1-100, for pngquant: "min-max")
        backup: Whether to create backup files
    """
    directory = Path(directory)
    if not directory.exists():
        print(f"Directory does not exist: {directory}")
        return
    
    # Find all PNG files recursively
    png_files = list(directory.rglob("*.png"))
    print(f"Found {len(png_files)} PNG files")
    
    total_original_size = 0
    total_compressed_size = 0
    processed_count = 0
    
    for png_file in png_files:
        print(f"\nProcessing: {png_file}")
        
        # Get original file size
        original_size = get_file_size(png_file)
        total_original_size += original_size
        
        # Create backup if enabled
        if backup:
            backup_path = png_file.with_suffix('.png.bak')
            if not backup_path.exists():
                import shutil
                shutil.copy2(png_file, backup_path)
                print(f"Backup created: {backup_path}")
        
        # Temporary output path
        temp_output = png_file.with_suffix('.compressed.png')
        
        # Select compression method
        success = False
        if method == "pngquant":
            quality = quality or "65-80"
            success = compress_png_with_pngquant(png_file, temp_output, quality)
        else:
            quality = quality or 20
            success = compress_png_with_pillow(png_file, temp_output, quality)
        
        if success and temp_output.exists():
            # Get compressed file size
            compressed_size = get_file_size(temp_output)
            total_compressed_size += compressed_size
            processed_count += 1
            
            # Calculate compression ratio
            compression_ratio = (1 - compressed_size / original_size) * 100
            
            print(f"Original size: {original_size:.2f} KB")
            print(f"Compressed size: {compressed_size:.2f} KB")
            print(f"Compression ratio: {compression_ratio:.1f}%")
            
            # Replace original file
            os.replace(temp_output, png_file)
            print(f"Successfully compressed: {png_file}")
        else:
            print(f"Compression failed: {png_file}")
    
    # Print summary statistics
    if processed_count > 0:
        total_compression_ratio = (1 - total_compressed_size / total_original_size) * 100
        print(f"\n=== SUMMARY ===")
        print(f"Total files processed: {processed_count}/{len(png_files)}")
        print(f"Total original size: {total_original_size:.2f} KB")
        print(f"Total compressed size: {total_compressed_size:.2f} KB")
        print(f"Overall compression ratio: {total_compression_ratio:.1f}%")
        print(f"Space saved: {total_original_size - total_compressed_size:.2f} KB")
    else:
        print("\nNo files were successfully compressed")

def install_pngquant():
    """
    Display installation instructions for pngquant
    """
    print("pngquant is not installed. Please install it for your system:")
    print("Ubuntu/Debian: sudo apt-get install pngquant")
    print("macOS: brew install pngquant")
    print("Windows: Download from https://pngquant.org/ and add to PATH")
    print("Alternatively: pip install pngquant")

if __name__ == "__main__":
    # Get target directory from user input
    target_directory = "../resource/image" # input("Enter directory path to process (default: current directory): ").strip()
    if not target_directory:
        target_directory = "."
    
    # Select compression method
    # print("Select compression method:")
    # print("1. pngquant (recommended, better compression)")
    # print("2. Pillow (no additional installation required)")
    
    # choice = input("Enter choice (1 or 2, default: 1): ").strip()
    choice = "1"
    method = "pngquant" if choice != "2" else "pillow"
    
    # Check if pngquant is available if selected
    if method == "pngquant":
        try:
            subprocess.run(["pngquant", "--version"], capture_output=True, check=True)
            print("pngquant is available")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("pngquant is not installed!")
            install_pngquant()
            sys.exit(1)
    
    # Ask for quality settings
    if method == "pngquant":
        # quality = input("Enter quality range (e.g., '65-80', default: '65-80'): ").strip()
        quality = "0-40"
        quality = quality or "65-80"
    else:
        quality = input("Enter quality level (1-100, lower=more compression, default: 20): ").strip()
        quality = int(quality) if quality else 20
    
    # Ask for backup preference
    backup_choice = "n" # input("Create backup files? (y/n, default: y): ").strip().lower()
    backup = backup_choice != "n"
    
    # Execute compression
    print(f"\nStarting compression with method: {method}")
    find_and_compress_png_files(
        directory=target_directory,
        method=method,
        quality=quality,
        backup=backup
    )