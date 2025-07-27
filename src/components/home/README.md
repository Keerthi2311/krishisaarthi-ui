# Home Components

This folder contains React components related to the main user interaction and advice features of the KrishiSaarthi application.

## Components

### AdviceResults.tsx

- **Purpose:** Displays AI-generated farming advice to users based on their queries (image or voice input).
- **Features:**
  - Shows a loading state while advice is being generated.
  - Renders a list of advice cards, each with a title, English summary, Kannada text, and optional audio.
  - Visual priority indication (high, medium, low) with color-coded cards.
  - Handles empty state with a prompt to upload an image or record a query.

### ImageUpload.tsx

- **Purpose:** Allows users to upload crop images for disease diagnosis and advice.
- **Features:**
  - File input for image selection.
  - Preview of the selected image.
  - Triggers AI analysis on upload.

### VoiceInput.tsx

- **Purpose:** Enables users to record voice queries for AI-powered advice.
- **Features:**
  - Start/stop recording controls.
  - Displays transcribed text.
  - Sends audio for backend processing.

## Usage

Import and use these components in the `/home` page or other relevant parts of the app:

```tsx
import AdviceResults from "@/components/home/AdviceResults";
import ImageUpload from "@/components/home/ImageUpload";
import VoiceInput from "@/components/home/VoiceInput";
```

## File Structure

- `AdviceResults.tsx` — Displays AI advice results
- `ImageUpload.tsx` — Image upload and preview
- `VoiceInput.tsx` — Voice recording and transcription

## Notes

- All components are written in TypeScript and use Tailwind CSS for styling.
- Designed for integration with the KrishiSaarthi AI backend and context providers.
