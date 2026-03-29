# AI Image Generation Setup

## Pollinations.ai - FREE & EASY!

Studio Forge uses **Pollinations.ai** for AI image generation.

### No Setup Required! 🎉

- ✅ **No API key needed**
- ✅ **Completely free**
- ✅ **No CORS issues**
- ✅ **No rate limits**
- ✅ **High quality** (Flux model)
- ✅ **Works instantly**

### How It Works

Pollinations.ai provides a simple URL-based API:
- Just send a prompt
- Get a real AI-generated image
- No authentication needed
- No configuration required

### Features

- **Model**: Flux (state-of-the-art)
- **Resolution**: Up to 1024x1024
- **Quality**: Professional grade
- **Speed**: 3-5 seconds
- **Prompt Enhancement**: Automatically adds quality keywords

### Testing

1. Click "Make with AI" in the top bar
2. Enter a prompt (e.g., "futuristic cyberpunk warrior character, neon armor")
3. Click "Forge"
4. Wait 3-5 seconds
5. Real AI-generated image appears!
6. Click "Import to Canvas" to add to design

### Example Prompts

**Characters:**
- "futuristic cyberpunk warrior, neon armor, detailed"
- "fantasy elf archer, forest background, magical"
- "robot character, metallic, glowing eyes"

**Environments:**
- "sci-fi city, neon lights, night time, cyberpunk"
- "fantasy castle, mountains, sunset, epic"
- "alien planet landscape, purple sky, moons"

**Game Assets:**
- "medieval sword, detailed, game asset, transparent"
- "magic spell effect, glowing particles, energy"
- "treasure chest, gold coins, fantasy game"

### Troubleshooting

**Images not generating?**
- Check browser console (F12) for errors
- Ensure you have internet connection
- Try a simpler prompt first

**Image quality not good?**
- Be more specific in your prompt
- Add style keywords: "detailed, 4k, professional"
- Try different prompts

### Why Pollinations.ai?

- ✅ **Zero setup** - works immediately
- ✅ **Free forever** - no credit card
- ✅ **No CORS** - works in browser
- ✅ **Fast** - 3-5 second generation
- ✅ **Quality** - uses Flux model
- ✅ **Reliable** - no API limits

## Technical Details

**API Endpoint:**
```
https://image.pollinations.ai/prompt/{prompt}?width={w}&height={h}&seed={seed}&nologo=true
```

**Parameters:**
- `prompt`: Your text description (URL encoded)
- `width`: Image width (default: 1024)
- `height`: Image height (default: 1024)
- `seed`: Random seed for variation
- `nologo`: Remove watermark

**Auto-Enhancement:**
Your prompts are automatically enhanced with:
- "high quality"
- "detailed"
- "professional"
- "4k"
- "digital art"
