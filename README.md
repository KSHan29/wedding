# Gina & Han Wedding Invite

Static wedding invitation site for GitHub Pages, styled after the Figma wedding landing page reference.

## Preview locally

Serve the folder with:

```sh
python3 -m http.server 8000
```

Then visit:

```text
http://127.0.0.1:8000/
```

## Responsive video

The page uses local source videos for preview:

- Desktop: `assets/video/PWS_Horizontal.mov`
- Mobile: `assets/video/PWS_Vertical.mp4`
- Fallback: `assets/video/wedding-film.m4v`

The horizontal and vertical source videos are large and intentionally ignored by Git. For GitHub Pages deployment, compress them into smaller web-safe files or host full-quality versions externally.

## RSVP

The RSVP button opens:

```text
https://docs.google.com/forms/d/e/1FAIpQLSfK4AeXJ0OOY9_4jHaGoByBNTTb6H6XWWID6tr3hS35Po8E6Q/viewform?usp=header
```

The inline form embed uses:

```text
https://docs.google.com/forms/d/e/1FAIpQLSfK4AeXJ0OOY9_4jHaGoByBNTTb6H6XWWID6tr3hS35Po8E6Q/viewform?embedded=true
```
