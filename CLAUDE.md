# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Commands
- `npm run dev` - Start development server (Next.js 15 with App Router)
- `npm run build` - Build for production 
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js configuration

### Package Management
- Uses npm (package-lock.json present)
- Node.js v18+ required
- React 19.0.0 and Next.js 15.3.4

## Project Architecture

### Framework & Technology Stack
- **Next.js 15** with App Router architecture
- **TypeScript 5** for full type safety
- **Tailwind CSS 4** with extensive custom configuration
- **Neumorphic Design System** - Custom design language with CSS custom properties
- **ApexCharts** for data visualization with custom theme integration
- **Radix UI** components enhanced with neumorphic variants
- **next-themes** for light/dark mode switching

### Core Architecture Patterns

#### 1. Neumorphic Theme System
The application uses a comprehensive neumorphic design system built with CSS custom properties:

- **Location**: `src/styles/themes/neumorphic.css` (1300+ lines)
- **Key Feature**: All components use CSS custom properties (`--neumorphic-*`) for consistent theming
- **Third-party Integration**: Custom CSS overrides target ApexCharts elements to maintain theme consistency
- **Theme Switching**: Automatic light/dark mode support via CSS custom properties

#### 2. Component Architecture
```
src/components/
├── charts/apex/          # Comprehensive ApexCharts library (14+ specialized charts)
├── forms/                # South African business forms (SA ID, VAT, Company Reg)
├── layout/               # DashboardLayout, ThemeProvider, TopMenuBar
├── sidebar/              # CurvedSidebar with inverse theming
├── ui/                   # Enhanced shadcn/ui components
└── neumorphic/           # Neumorphic design system components
```

#### 3. Data Architecture
- **Current State**: Structured sample data for development (20+ realistic datasets)
- **Migration Path**: Data structures match planned API responses exactly
- **Context**: South African vetting/supplier verification scenarios
- **Easy Migration**: Replace sample data imports with API calls when backend ready

### Key Application Features

#### South African Business Context
- **Forms**: SA ID validation, phone formatting, all 9 provinces, business registration
- **Compliance**: CIPC, SARS, BEE certificate verification types
- **Currency**: ZAR formatting throughout
- **Geographic**: Provincial distribution analysis and mapping

#### Specialized Chart Library
- **Line Charts**: Risk trends, performance monitoring, dual-axis correlations
- **Bar Charts**: Risk categories, verification types, compliance status comparisons
- **Pie/Donut Charts**: Service distributions, risk breakdowns, provincial analysis
- **Integration**: CSS bridge pattern ensures 100% neumorphic theme consistency

#### Advanced UI Components
- **Data Tables**: Production-ready with sorting, filtering, pagination
- **Curved Sidebar**: Unique design with inverse theme switching
- **Theme System**: Sophisticated dual-theme support with automatic switching
- **Error Boundaries**: Comprehensive error handling throughout

## Development Workflow

### Starting Development
1. Run `npm install` to install dependencies
2. Use `npm run dev` to start development server
3. Access at http://localhost:3000
4. Changes auto-reload via Next.js hot reloading

### Key Development Patterns

#### Component Development
- Follow neumorphic design system patterns
- Use TypeScript interfaces for all props
- Include error boundaries for complex components
- Test both light and dark themes

#### Theme Integration
- Use CSS custom properties (`--neumorphic-*`) for all styling
- Avoid hardcoded colors or theme values
- Test theme switching thoroughly
- For third-party libraries, add CSS overrides in `neumorphic.css`

#### Data Handling
- Use structured sample data during development
- Follow TypeScript interfaces that match API structure
- Include realistic South African business scenarios
- Plan for easy migration to real APIs

### Code Quality Standards

#### TypeScript Requirements
- Full type safety required
- No `any` types allowed
- Comprehensive interfaces for all data structures
- Generic types for reusable components

#### CSS Architecture
- CSS custom properties for all theme-related values
- Tailwind CSS for utility classes
- Component-specific styles in component files
- Global styles in `src/styles/themes/`
- Some components use a CSS bridge, follow that pattern where needed.

#### Error Handling
- Error boundaries around complex components
- Graceful failure modes with user feedback
- Console logging for debugging complex integrations
- Progressive enhancement approach

## Project Structure Highlights

### Critical Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/components/charts/apex/` - Comprehensive charting library
- `src/components/forms/` - South African business forms
- `src/styles/themes/` - Neumorphic design system CSS
- `docs/` - Project documentation including comprehensive project-doc.md

### Configuration Files
- `tailwind.config.ts` - Extended theme with neumorphic color system
- `next.config.ts` - Basic Next.js configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

### Documentation Resources
- `README.md` - Project overview and setup
- `docs/project-doc.md` - Comprehensive 500+ line architecture documentation
- `src/components/charts/apex/README.md` - Detailed charting library documentation
- Component-specific README files in major directories

## Special Considerations

### ApexCharts Integration
- **Critical**: ApexCharts requires CSS overrides for theme consistency
- **Location**: Theme overrides in `src/styles/themes/neumorphic.css`
- **Pattern**: Direct CSS targeting of ApexCharts DOM elements
- **Testing**: Always verify light/dark theme support for new charts

### South African Context
- Forms include SA-specific validation (ID numbers, VAT, company registration)
- Geographic data covers all 9 provinces
- Currency formatting uses ZAR throughout
- Business compliance types reflect local requirements

### Performance Considerations
- Charts use lazy loading via error boundaries
- Large datasets implement data sampling
- Theme switching is CSS-only for instant transitions
- Components use React.memo for efficient re-rendering

### Migration Planning
- Sample data structures match planned API responses
- Component props designed for easy API integration
- Database migration path documented in project-doc.md
- Theme system future-proofs UI changes

## Architectural Decisions

### CSS Bridge Pattern
For third-party libraries that don't integrate with our theme system:
1. Identify generated DOM elements and CSS classes
2. Create targeted CSS overrides using neumorphic variables
3. Use high-specificity selectors with `!important` when needed
4. Test theme switching functionality thoroughly

### Component Composition
- Base components provide core functionality
- Specialized components add business context
- Example components serve as implementation guides
- Error boundaries contain component failures

### Data Flow Strategy
- Structured sample data during development
- TypeScript interfaces enforce API contract
- Easy migration path when backend APIs available
- Realistic business scenarios for immediate value

This architecture supports a professional-grade South African vetting dashboard while maintaining design consistency and providing a clear path for future development.