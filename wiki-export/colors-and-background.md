# Colors and Background

The design of the East Grinstead Athletics Club website incorporates a vibrant and dynamic color scheme to reflect the energy and spirit of the club. Below is an overview of the colors and background animations used throughout the site:

## Primary Colors
- **Yellow (#FDB913)**: Represents energy, enthusiasm, and the club's identity. Used prominently in headings, buttons, and highlights.
- **Blue (#145FBA)**: Symbolizes trust, reliability, and professionalism. Used in gradients and as a secondary accent.
- **Dark Gray (#181A20)**: Provides a modern and sleek background for the site, ensuring readability and contrast.
- **White (#FFFFFF)**: Used for text and elements to maintain clarity and balance.

## Gradient Background
The site features an animated gradient background that transitions smoothly between the primary colors. This creates a visually appealing and dynamic effect that enhances the user experience.

### Animation Details
- **Gradient Colors**: The gradient transitions between dark gray (#181A20), blue (#145FBA), and yellow (#EBCA1B).
- **Animation**: The gradient background is animated using CSS keyframes to create a seamless pan effect.
- **Duration**: The animation runs continuously over a 30-second cycle.
- **Effect**: The animation gives the site a modern and engaging look while maintaining a professional aesthetic.

### CSS Implementation
```css
body {
  background: linear-gradient(120deg, #181a20 0%, #145fba 60%, #ebcb1b 100%);
  background-size: 200% 200%;
  background-position: 0% 50%;
  animation: bg-pan 30s linear infinite;
}

@keyframes bg-pan {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```

## Accessibility
The color scheme and background animations have been designed with accessibility in mind. High contrast between text and background ensures readability, and the animations are subtle enough to avoid causing distractions or discomfort for users.

This thoughtful use of colors and animations helps create a cohesive and engaging user experience that aligns with the club's vibrant identity.