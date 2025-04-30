# UINL DOCS

A documentation project built with Next.js and Nextra.

## Prerequisites

### Node.js and npm

This project requires Node.js and npm. To check if you have them installed, run:

```bash
node -v
npm -v
```

If you don't have Node.js installed, you can:

1. Download and install from [nodejs.org](https://nodejs.org/)
2. Or use a version manager like [nvm](https://github.com/nvm-sh/nvm)

Node.js comes with npm (Node Package Manager) by default, so you don't need to install it separately.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/dibasdauliya/uinl-docs.git
cd uinl-docs
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

## Project Structure

### TSV to Markdown Conversion

The project includes a `convert-tsv-to-md.mjs` file that converts TSV (Tab-Separated Values) files to Markdown format.

### CI/CD Workflow

The project has a GitHub Actions workflow configured in `.github/workflows`. When you push to the main branch, it automatically:

1. Runs the TSV to Markdown conversion script
2. Builds the project
3. Publishes the result to GitHub Pages

## Scripts

The `package.json` includes the following scripts:

- `dev`: Starts the development server
- `build`: Builds the project for production
- `start`: Starts the production server
- `deploy`: Builds the project and deploys it to GitHub Pages

## Technologies

- **Next.js**: React framework for production
- **Nextra**: Documentation site generator
- **Tailwind CSS**: Utility-first CSS framework
- **Flowbite React**: UI component library
- **GitHub Pages**: Hosting platform

## Package Configuration

The project uses the following configuration:

```json
{
  "name": "uinl-docs",
  "version": "0.0.1",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "deploy": "rm -rf .next && next build && touch .next/static/.nojekyll && gh-pages -d .next/static --repo https://github.com/dibasdauliya/uinl-docs.git"
  }
}
```

The deployment script:

1. Removes any existing build
2. Creates a new production build
3. Adds a `.nojekyll` file (prevents GitHub Pages from ignoring files that begin with an underscore)
4. Uses gh-pages to deploy the static files to the specified repository

## Contributing

Feel free to open issues or submit pull requests.

## License

[MIT](LICENSE)
