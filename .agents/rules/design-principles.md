# Design Principles to Follow

## Aesthetic-Usability Effect

- Use clean, consistent spacing (e.g., `gap-2`, `px-4`)
- Apply typography hierarchy (e.g., `text-lg font-semibold`)
- Add visual cues like subtle shadows or border separators to improve perceived usability

## Hick's Law

- Reduce visible options per screen
- Collapse complex filters/conditions into toggles or expandable sections

## Jakob’s Law

- Match WordPress admin conventions (e.g., table lists, modals, top bar)
- Stick to familiar placement of “Add New”, status toggles, and trash icons

## Fitts’s Law

- Make important actions (edit, delete) large and easy to click
- Avoid tiny icon-only targets unless grouped and spaced (e.g., `space-x-2`)

## Law of Proximity

- Group related controls using spacing and containers (`PanelBody`, `Card`)
- Visually bundle inputs related to conditions or filters

## Zeigarnik Effect

- Show progress in multi-step processes (stepper, breadcrumb, “Step X of Y”)
- Provide save state feedback (e.g., “Saving…”, “Unsaved changes” banners)

## Goal-Gradient Effect

- Emphasize the next step in workflows (highlight active step, use primary button styling)
- Use progress bars or steppers to encourage completion

## Law of Similarity

- Keep consistent styles for toggle switches, buttons, badges, and filters
- Align icon sizing and spacing across rows for visual rhythm

## Miller’s Law

- Avoid overloading users; chunk configurations into steps or panels
- Default to collapsed sections for advanced options

## Doherty Threshold

- Target sub-400ms interactions (loading skeletons, optimistic UI)
- Use loading states like spinners or shimmer placeholders
