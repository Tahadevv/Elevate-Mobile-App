# 🚀 Quick Start: New Splash Screens

## ⚡ Immediate Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Convert SVG to PNG
```bash
npm run convert-splash
```

### 3. Test Your App
```bash
npm start
```

## 🎯 What You Get

✅ **Professional Design** - Matches your Next.js website aesthetic  
✅ **Brand Colors** - Uses your actual brand blue (#0a7ea4)  
✅ **Better Quality** - 300x300 resolution instead of 200x200  
✅ **Theme Support** - Light and dark theme versions  
✅ **Modern Layout** - Clean, professional appearance  

## 🔧 Configuration Already Updated

Your `app.json` is already configured with:
- New background color (#0a7ea4)
- Larger image size (300px)
- Proper resize mode
- Updated Android icon colors

## 📱 Test Results

After running the conversion:
1. **Development**: `npm start` to see new splash screen
2. **Build**: `expo build:android` or `expo build:ios`
3. **Install**: Test on actual devices

## 🆘 If Conversion Fails

### Manual Method (Online)
1. Go to [Convertio](https://convertio.co/svg-png/)
2. Upload `assets/images/splash.svg`
3. Set size to 300x300 pixels
4. Download as PNG
5. Rename to `splash.png`
6. Place in `assets/images/` folder

### Alternative Tools
- **Figma**: Import SVG → Export PNG
- **Adobe Illustrator**: Open SVG → Export PNG
- **Sketch**: Import SVG → Export PNG

## 🎨 Customization

Want to change colors or layout?
- Edit `assets/images/splash.svg`
- Run `npm run convert-splash` again
- Test with `npm start`

## 📚 Full Documentation

See `SPLASH_SCREEN_SETUP.md` for complete details and troubleshooting.

---

**Ready to go?** Just run `npm run convert-splash` and you're done! 🎉
