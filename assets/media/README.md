# Media Folder Structure

This folder is organized for easy management of all images and videos used throughout the Visualize Studio website.

## Folder Structure

```
assets/media/
├── portfolio/          # All portfolio work organized by type
│   ├── logos/         # Logo designs and brand marks
│   ├── websites/      # Website screenshots and mockups
│   ├── print/        # Print design work (business cards, flyers, etc.)
│   ├── packaging/    # Packaging design work
│   ├── merch/        # Merchandise design work
│   └── social-media/ # Social media graphics and templates
│
├── clients/           # Client-specific work organized by client
│   ├── city-spice/   # All City Spice related images
│   ├── ghetto-garage/# All Ghetto Garage related images
│   ├── paps-prod/    # All Paps Production related images
│   ├── sopes-auto/   # All Sopes Auto Detailing related images
│   ├── nelly-cutz/   # All Nelly Cutz related images
│   └── other/        # Other client work
│
├── videos/            # Video content (reels, testimonials, process videos)
├── testimonials/      # Client testimonial images/avatars
└── process/          # Process documentation images
```

## How to Add Images

1. **Portfolio Images**: Add images to the appropriate subfolder in `portfolio/`
   - Logo designs → `portfolio/logos/`
   - Website screenshots → `portfolio/websites/`
   - Print work → `portfolio/print/`
   - etc.

2. **Client Work**: Add client-specific images to their folder in `clients/`
   - City Spice work → `clients/city-spice/`
   - Ghetto Garage work → `clients/ghetto-garage/`
   - etc.

3. **Videos**: Add video files to `videos/`
   - Supported formats: MP4, WebM, MOV

4. **Testimonials**: Add client avatars/photos to `testimonials/`

## Image Guidelines

- **Recommended formats**: JPG, PNG, SVG, WebP
- **File naming**: Use descriptive names with hyphens (e.g., `city-spice-logo-final.png`)
- **Optimization**: Compress images before uploading for faster page loads
- **Dimensions**: 
  - Portfolio images: 1200px width minimum
  - Logos: SVG preferred, or high-res PNG
  - Website screenshots: 1920px width recommended

## Usage in Code

Images in this folder can be referenced using:
```html
<img src="assets/media/portfolio/logos/example-logo.png" alt="Description">
```

The website will automatically pull from these folders when you add images.

