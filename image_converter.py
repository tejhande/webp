from PIL import Image
import os

def convert_to_webp(input_folder, output_folder):
    # Create output folder if not exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # List all files in input folder
    files = os.listdir(input_folder)

    # Iterate over each file
    for file_name in files:
        input_path = os.path.join(input_folder, file_name)
        output_path = os.path.join(output_folder, os.path.splitext(file_name)[0] + ".webp")

        # Open image
        try:
            img = Image.open(input_path)
        except IOError:
            print(f"Cannot open file: {input_path}")
            continue

        # Convert to WebP format
        try:
            img.save(output_path, "WEBP")
            print(f"Converted {file_name} to WebP")
        except Exception as e:
            print(f"Failed to convert {file_name} to WebP: {e}")

if __name__ == "__main__":
    # Use relative paths
    input_folder = "input_images"
    output_folder = "output_images"
    convert_to_webp(input_folder, output_folder)
