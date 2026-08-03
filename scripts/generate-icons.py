from PIL import Image, ImageDraw

def render_white_logo(canvas_size=2048):
    # Create transparent RGBA canvas
    img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Scale factor from 560.414 viewBox to canvas_size
    scale = canvas_size / 560.414

    # Padding inside canvas to make sure corners aren't clipped (e.g. 5% margin)
    margin = canvas_size * 0.05
    drawable_scale = (canvas_size - 2 * margin) / 560.414

    def draw_white_rrect(x1, y1, x2, y2, rx=18):
        box = [
            margin + x1 * drawable_scale,
            margin + y1 * drawable_scale,
            margin + x2 * drawable_scale,
            margin + y2 * drawable_scale
        ]
        draw.rounded_rectangle(box, radius=rx * drawable_scale, fill=(255, 255, 255, 255))

    # Row 1 (Top)
    draw_white_rrect(0, 24.92, 149.145, 173.965)
    draw_white_rrect(178.704, 24.92, 560.414, 173.965)

    # Row 2 (Middle)
    draw_white_rrect(0, 205.632, 149.145, 354.675)
    draw_white_rrect(178.704, 205.632, 560.414, 354.675)

    # Row 3 (Bottom)
    draw_white_rrect(0, 386.343, 149.145, 535.387)
    draw_white_rrect(178.704, 386.343, 560.414, 535.387)

    return img

if __name__ == '__main__':
    # Render at 2048x2048 for maximum anti-aliased detail
    master = render_white_logo(2048)

    # Generate 512x512 High-Res PNG (White icon on transparent bg)
    img512 = master.resize((512, 512), Image.Resampling.LANCZOS)
    img512.save('public/icon.png')
    img512.save('public/tray-icon.png')
    img512.save('public/2tier-logo.png')

    # Generate multi-resolution ICO for favicon and tray
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    ico_imgs = [master.resize(s, Image.Resampling.LANCZOS) for s in sizes]
    
    # Save crisp white favicon.ico
    ico_imgs[0].save('public/favicon.ico', format='ICO', sizes=sizes, append_images=ico_imgs[1:])
    ico_imgs[0].save('public/icon.ico', format='ICO', sizes=sizes, append_images=ico_imgs[1:])

    print("White high-quality icons generated successfully!")
