# TodoList Application

A modern, feature-rich task management application built with React, TypeScript, Vite, and Tailwind CSS. This application includes advanced features like timers, avatar customization, and a premium UI/UX experience.

## Features

### Core Features
- ✅ **Task Management**: Create, edit, delete, and complete tasks
- ✅ **Subtasks**: Break down tasks into smaller subtasks
- ✅ **Priority System**: Color-coded priority levels
- ✅ **Due Dates**: Calendar integration for task deadlines
- ✅ **Tags**: Organize tasks with custom tags
- ✅ **LocalStorage Persistence**: All data saved locally

### Advanced Features
- ⏱️ **Alarm Timer**: Pomodoro-style timer for task tracking
- 👤 **User Profiles**: Customizable profiles with avatars
- 🎨 **Avatar Constructor**: Create custom avatars using DiceBear API
- 🌙 **Dark/Light Theme**: Automatic theme switching
- 📱 **Responsive Design**: Works on all devices (320px - 8K)
- 🎭 **Premium UI**: Glassmorphism, animations, and smooth transitions

### Security & Performance
- 🔒 **Input Validation**: Zod schema validation
- 🛡️ **XSS Protection**: HTML sanitization
- ⚡ **Performance Optimized**: Code splitting, memoization, lazy loading
- 📊 **Monitoring**: Sentry integration for error tracking
- 📈 **Analytics**: Vercel Analytics and Speed Insights

## Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/todo-list-app.git
cd todo-list-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Usage

### Basic Usage
1. **Create a Task**: Click "Add New Task" and fill in the form
2. **Complete Tasks**: Click the checkbox to mark as complete
3. **Add Subtasks**: Expand a task and add subtasks
4. **Set Timer**: Click "Timer" on any task to start a Pomodoro timer
5. **Customize Profile**: Click "Profile" to edit your username and avatar

### Advanced Usage
- **Avatar Constructor**: Create custom avatars with different styles
- **Alarm System**: Enable alarms for timer notifications
- **Sound Selection**: Choose from 5 different alarm sounds
- **Multi-tab Sync**: Changes sync across browser tabs

## Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Hooks, LocalStorage
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Validation**: Zod
- **Monitoring**: Sentry, Vercel Analytics

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── utils/              # Utility functions
├── lib/                # Library utilities
└── globals.css         # Global styles
```

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Required
VITE_SENTRY_DSN=your_sentry_dsn
VITE_VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# Optional
VITE_API_BASE_URL=https://api.example.com
VITE_FEATURE_FLAGS=enableAlarms,enableAvatarConstructor
```

### Vercel Configuration
The application is configured for Vercel deployment. See `vercel.json` for details.

## Development

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Code Style
- Follow ESLint rules
- Use TypeScript for all new code
- Follow React best practices
- Use Prettier for formatting

## Testing

### Unit Tests
```bash
npm run test
```

### Component Tests
```bash
npm run test:components
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
- **Target**: 80% coverage
- **Tools**: Jest, React Testing Library
- **Focus**: Hooks, components, utilities

## Performance

### Optimization Techniques
1. **Code Splitting**: Dynamic imports for routes and heavy components
2. **Memoization**: `React.memo()`, `useMemo()`, `useCallback()`
3. **Lazy Loading**: `React.lazy()` for components
4. **Virtualization**: Planned for large lists
5. **Caching**: React Query for API responses

### Performance Metrics
- **TTI** (Time to Interactive): < 1.5s
- **FCP** (First Contentful Paint): < 0.8s
- **LCP** (Largest Contentful Paint): < 1.2s
- **CLS** (Cumulative Layout Shift): < 0.05

## Security

### Security Features
- **Input Validation**: Zod schema validation
- **HTML Sanitization**: DOMPurify (if implemented)
- **XSS Protection**: CSP headers, safe attribute binding
- **Data Validation**: All user inputs validated
- **Error Handling**: Graceful error boundaries

### Security Best Practices
- No `innerHTML` without sanitization
- CSP headers configured
- Input validation on all forms
- Error boundaries for crash recovery

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Vercel**: Automatic deployments on push
- **Sentry**: Error monitoring in production

### Environment Variables
```env
# Production
VITE_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/...
VITE_VERCEL_ANALYTICS_ID=your-analytics-id
```

## Monitoring

### Error Tracking
- **Sentry**: Real-time error monitoring
- **Vercel Logs**: Deployment and runtime logs
- **Browser Console**: Development debugging

### Performance Monitoring
- **Vercel Analytics**: Core Web Vitals
- **Sentry Performance**: Transaction monitoring
- **Custom Metrics**: Application-specific metrics

## Contributing

### How to Contribute
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Create pull request

### Code Review Guidelines
- All code must pass linting and tests
- New features must include tests
- Documentation must be updated
- Follow existing code style

### Development Workflow
1. **Branch**: `feature/your-feature`
2. **Test**: Run `npm run test`
3. **Lint**: Run `npm run lint`
4. **Build**: Run `npm run build`
5. **PR**: Create pull request

## Documentation

### API Documentation
See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API documentation.

### Developer Guide
See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for development instructions.

### Usage Examples
See [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) for code examples.

## Roadmap

### Planned Features
- [ ] Virtual scrolling for large task lists
- [ ] Offline mode with IndexedDB
- [ ] Multi-user collaboration
- [ ] Export/Import data
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts
- [ ] Drag and drop reordering
- [ ] Calendar view

### Performance Improvements
- [ ] Virtualization for lists
- [ ] Image optimization
- [ ] Bundle size reduction
- [ ] Service worker for offline support

## Troubleshooting

### Common Issues
1. **"Rendered more hooks than during the previous render"**
   - Ensure hooks are called unconditionally at the top level

2. **"LocalStorage quota exceeded"**
   - Implement IndexedDB for larger datasets

3. **"CORS error with external APIs"**
   - Use proxy or cache responses locally

4. **"Performance issues with large lists"**
   - Implement virtualization or pagination

### Debugging
```bash
# Check bundle size
npm run build -- --report

# Analyze dependencies
npm run build -- --analyze

# Check for unused dependencies
npx depcheck
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **GitHub Issues**: [Create an issue](https://github.com/your-username/todo-list-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/todo-list-app/discussions)
- **Stack Overflow**: Tag with `todo-list-app`

## Acknowledgments

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [DiceBear](https://dicebear.com/)
- [Sentry](https://sentry.io/)
- [Vercel](https://vercel.com/)

## Contact

- **Project Link**: [https://github.com/your-username/todo-list-app](https://github.com/your-username/todo-list-app)
- **Email**: your-email@example.com

---

**Built with ❤️ using React, TypeScript, and Vite**