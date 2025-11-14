# Tri-Card Genius ✨

A modern flashcard application designed to revolutionize your learning experience with **three-sided flashcards**. Go beyond traditional two-sided cards by adding an extra dimension for examples, mnemonics, context, or additional explanations.

## 🎯 Features

- **Three-Sided Flashcards**: Create cards with front, back, and a third side for enhanced learning
- **AI-Powered Content Generation**: Leverage Google's Gemini AI to automatically generate flashcard content
- **Deck Management**: Organize your flashcards into multiple decks for different subjects or topics
- **Smart Learning Mode**: Study your cards with an intuitive learning interface
- **Bulk Import**: Upload CSV files to quickly create multiple flashcards at once
- **Local Storage**: All your data is stored locally in your browser - no account required
- **Modern UI**: Clean, responsive interface built with React and TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dtruong46me/tri-card-genius.git
cd tri-card-genius
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
    pageSize: 'A4'
});
```

## Configuration
Default configuration can be placed in `tri-card-genius.config.js` or in package.json under `"triCardGenius"`:
```js
module.exports = {
    pageSize: 'A4',
    columns: 3,
    rows: 3,
    bleedMm: 3,
    marginMm: 10,
```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

## 📖 How to Use

### Creating Flashcards

1. **Manual Creation**: Click the "+" button to create a new flashcard with custom content for all three sides
2. **AI Generation**: Use the AI-powered feature to automatically generate flashcard content based on a topic
3. **CSV Import**: Upload a CSV file with multiple flashcards to quickly build your deck

### Managing Decks

- Create multiple decks to organize flashcards by subject or category
- Each flashcard can be assigned to a specific deck
- View and manage all cards within a deck
- Mark cards as favorites for quick access

### Learning Mode

- Study your flashcards in an interactive learning interface
- Flip through all three sides of each card
- Navigate between cards with intuitive controls
- Track your progress through the deck

## 🛠️ Built With

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Google Generative AI** - AI-powered content generation
- **Local Storage API** - Browser-based data persistence

## 📦 Project Structure

```
tri-card-genius/
├── components/          # React components
│   ├── DeckList.tsx    # Deck management interface
│   ├── DeckView.tsx    # Individual deck view
│   ├── FlashcardCreator.tsx  # Card creation form
│   ├── FlashcardViewer.tsx   # Learning interface
│   └── icons/          # SVG icon components
├── services/           # External service integrations
│   └── geminiService.ts  # Google Gemini AI integration
├── App.tsx            # Main application component
├── types.ts           # TypeScript type definitions
└── index.tsx          # Application entry point
```

## 🚧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**dtruong46me**

- GitHub: [@dtruong46me](https://github.com/dtruong46me)
- Repository: [tri-card-genius](https://github.com/dtruong46me/tri-card-genius)

---

Made with ❤️ for better learning