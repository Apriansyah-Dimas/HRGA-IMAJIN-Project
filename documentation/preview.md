# Attachment Preview Documentation

A complete reference guide for implementing attachment previews in the HRGA application. This document covers both the inline preview in drawers and the full-screen attachment viewer.

---

## Overview

The system supports two types of attachment previews:
1. **Inline Preview** - Displayed within a drawer/card (thumbnails)
2. **Full-Screen Viewer** - Modal overlay for detailed viewing with zoom/drag

Supported file types:
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- **Documents**: `.pdf`

---

## DOM Structure

### Inline Preview (in Drawer)

```
.drawer-detail__attachment-list
  └── article.drawer-detail__attachment.drawer-detail__attachment--interactive
      └── div.drawer-detail__attachment-media
          └── div.drawer-detail__attachment-preview-shell
              └── img.drawer-detail__attachment-image (or iframe for PDF)
          └── div.drawer-detail__attachment-overlay
              └── span.drawer-detail__attachment-overlay-label ("Preview")
```

### Full-Screen Viewer

```
.attachment-viewer-overlay.is-open
  └── button.attachment-viewer-overlay__backdrop (click to close)
  └── section.attachment-viewer
      ├── div.attachment-viewer__top-actions
      │   ├── button.attachment-viewer__icon-button--close
      │   └── button.attachment-viewer__icon-button--download
      ├── div.attachment-viewer__dock
      │   ├── button.attachment-viewer__icon-button (zoom out)
      │   ├── button.attachment-viewer__icon-button (reset)
      │   └── button.attachment-viewer__icon-button (zoom in)
      └── div.attachment-viewer__viewport
          └── div.attachment-viewer__stage
              └── div.attachment-viewer__asset
                  └── img.attachment-viewer__media.attachment-viewer__media--image
```

---

## CSS Specifications

### Inline Preview (Drawer)

```css
.drawer-detail__attachment-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.drawer-detail__attachment {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.drawer-detail__attachment--interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px oklch(0.18 0.02 255 / 0.15);
}

.drawer-detail__attachment-media {
  aspect-ratio: 4/3;
  background: oklch(0.96 0.01 255);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-detail__attachment-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer-detail__attachment-preview-shell--document {
  background: oklch(0.92 0.02 255);
}

.drawer-detail__attachment-overlay {
  position: absolute;
  inset: 0;
  background: oklch(0.18 0.02 255 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.drawer-detail__attachment--interactive:hover .drawer-detail__attachment-overlay {
  opacity: 1;
}

.drawer-detail__attachment-overlay-label {
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  background: oklch(0.3 0.02 255 / 0.8);
  border-radius: 999px;
}
```

### Full-Screen Viewer Overlay

```css
.attachment-viewer-overlay {
  position: fixed;
  inset: 0;
  display: block;
  pointer-events: none;
  z-index: 50;
}

.attachment-viewer-overlay.is-open {
  pointer-events: auto;
}

.attachment-viewer-overlay__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: oklch(0.12 0.02 255 / 0.85);
  cursor: pointer;
}

.attachment-viewer-overlay.is-open .attachment-viewer-overlay__backdrop {
  animation: fadeIn 200ms ease;
}
```

### Viewer Container

```css
.attachment-viewer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  width: min(90vw, 900px);
  height: min(85vh, 700px);
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 25px 50px oklch(0.18 0.02 255 / 0.25);
  display: grid;
  grid-template-rows: auto 1fr auto;
  opacity: 0;
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease;
}

.attachment-viewer-overlay.is-open .attachment-viewer {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}
```

### Viewer Actions (Top Bar)

```css
.attachment-viewer__top-actions {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  gap: 8px;
}

.attachment-viewer__icon-button {
  width: 40px;
  height: 40px;
  border: 0;
  background: oklch(0.96 0.01 255);
  border-radius: 10px;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: oklch(0.36 0.02 255);
  transition: background 0.15s ease, color 0.15s ease;
}

.attachment-viewer__icon-button:hover {
  background: oklch(0.92 0.01 255);
  color: oklch(0.18 0.02 255);
}

.attachment-viewer__icon-button--close:hover {
  background: #fee2e2;
  color: #dc2626;
}
```

### Viewer Dock (Bottom Bar)

```css
.attachment-viewer__dock {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(to top, oklch(0.98 0.005 255) 0%, #ffffff 100%);
  border-radius: 0 0 20px 20px;
}
```

### Viewer Viewport

```css
.attachment-viewer__viewport {
  overflow: auto;
  display: grid;
  place-items: center;
  padding: 20px;
  cursor: grab;
}

.attachment-viewer__viewport.is-dragging {
  cursor: grabbing;
}

.attachment-viewer__stage {
  display: grid;
  place-items: center;
  transition: transform 0.1s ease;
  transform: translate(var(--viewer-offset-x, 0), var(--viewer-offset-y, 0)) scale(var(--viewer-scale, 1));
}
```

---

## JavaScript Implementation

### 1. Create Attachment Preview (for inline display)

```javascript
function createAttachmentPreview(
  fileData,
  options = {
    imageClassName: "drawer-detail__attachment-image",
    frameClassName: "drawer-detail__attachment-frame",
  },
) {
  if (!fileData?.dataUrl) {
    return null;
  }

  const imageClassName = options.imageClassName ?? "drawer-detail__attachment-image";
  const frameClassName = options.frameClassName ?? "drawer-detail__attachment-frame";

  if (fileData.type?.startsWith("image/")) {
    const image = createElement("img", imageClassName);
    image.src = fileData.dataUrl;
    image.alt = fileData.name || "Attachment preview";
    return image;
  }

  if (fileData.type === "application/pdf") {
    const frame = createElement("iframe", frameClassName);
    frame.src = fileData.dataUrl;
    frame.title = fileData.name || "Attachment preview";
    return frame;
  }

  return null;
}
```

### 2. Open Attachment Viewer

```javascript
function openAttachmentViewer(attachment) {
  state.attachmentViewer.isOpen = true;
  state.attachmentViewer.attachment = { ...attachment };
  render();
}

function closeAttachmentViewer() {
  state.attachmentViewer.isOpen = false;
  state.attachmentViewer.attachment = null;
  render();
}
```

### 3. Render Attachment List in Drawer

```javascript
function renderAttachments(attachments, content) {
  if (attachments.length > 0) {
    const attachmentList = createElement("div", "drawer-detail__attachment-list");

    attachments.forEach((attachment) => {
      const attachmentCard = createElement(
        "article",
        `drawer-detail__attachment drawer-detail__attachment--interactive${
          attachment.type === "application/pdf"
            ? " drawer-detail__attachment--document"
            : ""
        }`,
      );

      const attachmentMedia = createElement("div", "drawer-detail__attachment-media");
      const attachmentOverlayLabel = createElement(
        "span",
        "drawer-detail__attachment-overlay-label",
        "Preview",
      );
      const preview = createAttachmentPreview(attachment);
      const previewShell = createElement("div", "drawer-detail__attachment-preview-shell");
      const attachmentOverlay = createElement("div", "drawer-detail__attachment-overlay");

      attachmentCard.setAttribute("aria-label", `Preview ${attachment.name || "attachment"}`);
      attachmentCard.tabIndex = 0;
      attachmentCard.role = "button";
      
      attachmentCard.addEventListener("click", () => {
        openAttachmentViewer(attachment);
      });
      
      attachmentCard.addEventListener("keydown", (nativeEvent) => {
        if (nativeEvent.key === "Enter" || nativeEvent.key === " ") {
          nativeEvent.preventDefault();
          openAttachmentViewer(attachment);
        }
      });

      attachmentOverlay.append(attachmentOverlayLabel);

      if (preview) {
        previewShell.append(preview);
      } else {
        previewShell.append(createElement("div", "drawer-detail__attachment-paper-fallback"));
      }

      previewShell.append(attachmentOverlay);
      attachmentMedia.append(previewShell);
      attachmentCard.append(attachmentMedia);
      attachmentList.append(attachmentCard);
    });

    content.append(attachmentList);
  }
}
```

---

## Attachment Data Structure

```javascript
const attachment = {
  name: "file.jpg",           // Display name
  type: "image/jpeg",         // MIME type
  dataUrl: "data:image/jpeg;base64,...", // Base64 encoded content
};
```

---

## Interactions

### Hover State
- Card lifts up with shadow
- Overlay appears with "Preview" label
- Cursor changes to pointer

### Click/Tap
- Opens full-screen viewer with animation
- Viewer appears centered with backdrop

### Full-Screen Viewer
- **Close**: Click X button, click backdrop, or press Escape
- **Zoom**: Use +/- buttons or mouse wheel
- **Pan**: Click and drag to move image
- **Reset**: Click reset button to return to default view
- **Download**: Click download button to save file

### Keyboard Navigation
- Tab to navigate between attachments
- Enter or Space to open viewer
- Escape to close viewer

---

## Animation Specifications

| Element | Property | Duration | Easing |
|--------|----------|----------|--------|
| Viewer Open | transform, opacity | 300ms | cubic-bezier(0.22, 1, 0.36, 1) |
| Overlay Backdrop | opacity | 200ms | ease |
| Card Hover | transform, box-shadow | 200ms | ease |
| Overlay Fade | opacity | 200ms | ease |
| Zoom/Drag | transform | 100ms | ease |

---

## Accessibility

- All interactive elements have `role="button"`
- Proper `aria-label` on attachment cards
- Keyboard accessible (Tab, Enter, Space, Escape)
- Focus visible states on all buttons
- `tabIndex="0"` on attachment cards for keyboard navigation
- Viewer has `role="dialog"`, `aria-modal="true"`, `aria-label`

---

## Best Practices

1. **Always wrap attachments in a list container** - Use `drawer-detail__attachment-list` for proper grid layout

2. **Use the `--interactive` modifier** - Add hover effects and click handlers only to interactive attachments

3. **Check for null dataUrl** - Always validate `fileData.dataUrl` before creating preview

4. **Support both image and PDF** - Handle both types in preview creation

5. **Add fallback for unsupported types** - Use `drawer-detail__attachment-paper-fallback` for non-previewable files

6. **Maintain aspect ratio** - Use `aspect-ratio: 4/3` on media containers for consistent thumbnails

---

## Troubleshooting

### Preview not showing
- Check that `dataUrl` exists in attachment object
- Verify MIME type starts with "image/" or is "application/pdf"

### Viewer not opening
- Ensure state is properly set: `state.attachmentViewer.isOpen = true`
- Check that overlay is being appended to shell
- Verify `is-open` class is being added after render

### Cannot close viewer
- Check close button has proper event listener
- Verify backdrop click handler calls `closeAttachmentViewer()`
- Ensure Escape key handler is set

### Zoom not working
- Check `--viewer-scale` CSS variable is being set via JavaScript
- Verify `clampScale` function limits scale between 1 and 4

---

## Changelog

- **2026-03-27**: Initial documentation based on Calendar event attachments and drawer detail attachments
- **2026-03-27**: Added full-screen viewer specifications with zoom/drag functionality
- **2026-03-27**: Documented accessibility features and keyboard navigation