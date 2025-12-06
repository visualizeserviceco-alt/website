`1# Media Folder Guide - Quick Reference

## 📁 Folder Structure Created

```
assets/media/
├── portfolio/
│   ├── logos/          ← Add logo designs here
│   ├── websites/       ← Add website screenshots here
│   ├── print/          ← Add print design work here
│   ├── packaging/      ← Add packaging designs here
│   ├── merch/          ← Add merchandise designs here
│   └── social-media/   ← Add social media graphics here
│
├── clients/
│   ├── city-spice/     ← All City Spice related images
│   ├── ghetto-garage/  ← All Ghetto Garage related images
│   ├── paps-prod/      ← All Paps Production related images
│   ├── sopes-auto/     ← All Sopes Auto Detailing related images
│   ├── nelly-cutz/     ← All Nelly Cutz related images
│   └── other/          ← Other client work
│
├── videos/             ← Video content (MP4, WebM, MOV)
├── testimonials/       ← Client testimonial images/avatars
└── process/            ← Process documentation images
```

## 🎯 How to Add Images

### For Portfolio Work:

1. **Logo Designs**: 
   - Add to: `assets/media/portfolio/logos/`
   - Example: `assets/media/portfolio/logos/city-spice-logo.png`
   - They'll appear in the Portfolio page under "Logos & Brand Marks"

2. **Website Screenshots**:
   - Add to: `assets/media/portfolio/websites/`
   - Example: `assets/media/portfolio/websites/client-website-screenshot.png`
   - They'll appear in the Portfolio page under "Websites"

3. **Print Design**:
   - Add to: `assets/media/portfolio/print/`
   - Example: `assets/media/portfolio/print/business-card-design.png`
   - They'll appear in the Portfolio page under "Print Design"

4. **Packaging**:
   - Add to: `assets/media/portfolio/packaging/`
   - Example: `assets/media/portfolio/packaging/product-label.png`

5. **Merchandise**:
   - Add to: `assets/media/portfolio/merch/`
   - Example: `assets/media/portfolio/merch/t-shirt-design.png`

### For Client-Specific Work:

- Add all images related to a specific client to their folder:
  - City Spice → `assets/media/clients/city-spice/`
  - Ghetto Garage → `assets/media/clients/ghetto-garage/`
  - etc.

## 📝 Adding Images to Pages

### Option 1: Manual (Recommended for now)
Add images directly to HTML:

```html
<div class="portfolio-item">
  <img src="assets/media/portfolio/logos/your-logo.png" alt="Logo Design">
  <div class="portfolio-overlay">
    <h3>Client Name</h3>
    <p>Logo Design</p>
  </div>
</div>
```

### Option 2: Update Portfolio.html
Edit `pages/Portfolio.html` and add new portfolio items in the appropriate section.

## 🎨 Image Guidelines

- **Formats**: JPG, PNG, SVG, WebP
- **Naming**: Use descriptive names with hyphens (e.g., `city-spice-logo-final.png`)
- **Optimization**: Compress images before uploading
- **Dimensions**:
  - Portfolio: 1200px width minimum
  - Logos: SVG preferred, or high-res PNG
  - Websites: 1920px width recommended

## 📄 Pages Created

1. **Portfolio Page** (`/portfolio`)
   - Full portfolio showcase with filters
   - Organized by category
   - Accessible from homepage "View All My Work" button

2. **Routes Added**:
   - `/portfolio` - Portfolio page
   - `/process` - Process page (existing)
   - `/payments` - Payments page (existing)
   - `/terms` - Terms page (existing)

## 🚀 Next Steps

1. Add your images to the appropriate folders
2. Update `pages/Portfolio.html` with your actual portfolio items
3. Update `index.html` portfolio section with your featured work
4. Test the portfolio page at: `http://localhost:5001/portfolio`

## 💡 Tips

- Keep file names descriptive and consistent
- Use the same naming convention across folders
- Organize by project/client when possible
- Update the portfolio HTML as you add new work

