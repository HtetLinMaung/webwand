# WebWand Microservice

WebWand is a versatile microservice powered by Node.js and Puppeteer, designed to automate a wide range of web-based tasks. This service not only captures full-page screenshots and executes custom scripts but also excels in web scraping, automated form submission, and navigating pages that require authentication. It's an ideal solution for tasks ranging from data extraction and automated testing to rendering web pages for archival purposes.

## Features

- **Site-to-PDF/Image Rendering**: Convert web pages into PDFs or images with custom settings like page format, orientation, and scale.
- **Screenshot Capture**: Take screenshots of web pages, with options for full-page capture, format selection, and viewport customization.
- **Web Scraping**: Programmatically extract specific data from web pages, ideal for gathering information from sites without an API.
- **Automated Form Submission**: Fill and submit web forms automatically, useful for testing or automating routine web interactions.
- **Authentication Support**: Handle web pages requiring login by passing credentials or tokens, allowing access to restricted content.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Docker (for containerized deployment)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/HtetLinMaung/webwand.git
```

2. Navigate to the project directory:

```bash
cd webwand
```

3. Install dependencies:

```bash
npm install
```

## Running the Service

- To start the service locally:

```bash
npm start
```

- To run with Docker:

```bash
docker-compose up
```

## Site-to-PDF/Image Rendering API

The WebWand service includes an API endpoint for converting web pages into PDFs or images. This feature supports various custom options such as page format, orientation, scaling, margins, and also handles authentication for restricted pages.

### Endpoint Details

- **Endpoint**: `/webwand/site-to-pdf`
- **Method**: `POST`
- **Body Parameters**:
  - `url`: URL of the web page to render.
  - `format`: (optional) Page format for PDF (e.g., 'A4', 'Letter'). Defaults to 'A4'.
  - `output`: (optional) Custom name for the output file.
  - `landscape`: (optional) Boolean to set the page in landscape orientation.
  - `scale`: (optional) Scale factor for the webpage rendering.
  - `margin`: (optional) Margins for the PDF (top, bottom, left, right).
  - `displayHeaderFooter`: (optional) Boolean to display headers and footers.
  - `headerTemplate`: (optional) HTML template for the header.
  - `footerTemplate`: (optional) HTML template for the footer.
  - `preferCssPageSize`: (optional) Boolean to use CSS page size settings.
  - `pageRanges`: (optional) Specific page ranges to render.
  - `auth`: (optional) Authentication details (type, username, password, token).
  - `content`: (optional) Direct HTML content or file path for rendering.
  - `contentType`: (optional) Specifies the type of content ('file' for file path).
  - `image`: (optional) Set to true to render the page as an image instead of a PDF.
  - `imageOutput`: (optional) Custom file name for the output image.
  - `verbose`: (optional) Enables verbose logging for debugging.

### Usage Example

To convert a web page to a PDF:

```javascript
fetch("http://localhost:3000/webwand/site-to-pdf", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://example.com",
    format: "A4",
    landscape: false,
    auth: {
      type: "basic",
      username: "user",
      password: "pass",
    },
  }),
})
  .then((response) => response.json())
  .then((data) => {
    // Process the response data
  });
```

## Screenshot API

The `webwand/screenshot` endpoint in the WebWand service allows users to capture screenshots of web pages, with options for customization and authentication.

### Endpoint Details

- **Endpoint**: `/webwand/screenshot`
- **Method**: `POST`
- **Body Parameters**:
  - `url`: The URL of the web page to capture.
  - `format`: (optional) The image format ('png', 'jpeg'). Defaults to 'png'.
  - `quality`: (optional) The quality of the image (if using 'jpeg').
  - `fullPage`: (optional) Boolean indicating whether to capture the full scrollable page. Defaults to true.
  - `waitUntil`: (optional) When to consider navigation succeeded. Defaults to 'networkidle2'.
  - `timeout`: (optional) Maximum time to wait for in milliseconds. Defaults to '30000'.
  - `viewPortWidth`: (optional) The width of the viewport. Defaults to 1366.
  - `viewPortHeight`: (optional) The height of the viewport. Defaults to 768.
  - `customScript`: (optional) A JavaScript code to execute before taking the screenshot.
  - `auth`: (optional) Authentication details (type, username, password, token).

### Usage Example

To capture a screenshot of a web page:

```javascript
fetch("http://localhost:3000/webwand/screenshot", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://example.com",
    format: "png",
    fullPage: true,
    auth: {
      type: "basic",
      username: "user",
      password: "pass",
    },
  }),
})
  .then((response) => response.json())
  .then((data) => {
    // Process the screenshot data
  });
```

## Web Scraping API

The `webwand/scrape` endpoint enables users to scrape data from web pages, offering flexibility in terms of selectors, viewport settings, and authentication.

### Endpoint Details

- **Endpoint**: `/webwand/scrape`
- **Method**: `POST`
- **Body Parameters**:
  - `url`: The URL of the web page from which to scrape data.
  - `selectors`: An object mapping keys to CSS selectors or XPath expressions for the data to be extracted.
  - `waitUntil`: (optional) When to consider navigation succeeded. Defaults to 'networkidle2'.
  - `timeout`: (optional) Maximum time to wait for in milliseconds. Defaults to '30000'.
  - `viewPortWidth`: (optional) The width of the viewport. Defaults to 1366.
  - `viewPortHeight`: (optional) The height of the viewport. Defaults to 768.
  - `auth`: (optional) Authentication details (type, username, password, token) for accessing restricted pages.

### Usage Example

To scrape data from a web page:

```javascript
fetch("http://localhost:3000/webwand/scrape", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://example.com",
    selectors: {
      title: "h1",
      description: 'meta[name="description"]',
    },
    auth: {
      type: "basic",
      username: "user",
      password: "pass",
    },
  }),
})
  .then((response) => response.json())
  .then((data) => {
    // Process the scraped data
  });
```

## Automated Form Submission API

The `webwand/submit-form` endpoint is designed for automating the process of filling out and submitting web forms. This is especially useful for testing or automating routine data entry tasks.

### Endpoint Details

- **Endpoint**: `/webwand/submit-form`
- **Method**: `POST`
- **Body Parameters**:
  - `url`: The URL of the web page containing the form.
  - `formData`: An object representing the form fields (as keys) and their respective values to fill in.
  - `submitButtonSelector`: (optional) A CSS selector or XPath expression for the form's submit button.
  - `waitUntil`: (optional) Condition to consider navigation successful. Defaults to 'networkidle2'.
  - `timeout`: (optional) Maximum time in milliseconds to wait. Defaults to '30000'.
  - `auth`: (optional) Authentication details (type, username, password, token) for accessing restricted forms.
  - `viewPortWidth`: (optional) The width of the viewport. Defaults to 1366.
  - `viewPortHeight`: (optional) The height of the viewport. Defaults to 768.

### Usage Example

To automate form submission:

```javascript
fetch("http://localhost:3000/webwand/submit-form", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://example.com/form",
    formData: {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
    },
    submitButtonSelector: "#submit-button",
    auth: {
      type: "basic",
      username: "user",
      password: "pass",
    },
  }),
})
  .then((response) => response.json())
  .then((data) => {
    // Handle the response after form submission
  });
```

## Docker Compose Setup

To deploy the WebWand microservice using Docker Compose, use the following configuration:

```yaml
webwand:
  image: htetlinmaung/webwand
  restart: always
  ports:
    - "8004:3000"
  environment:
    - PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
  volumes:
    - ./images:/app/images
    - ./reports:/app/pdf
    - ./fonts:/usr/share/fonts/custom-fonts
```

### Configuration Details:

- `Port`: The service is exposed on port 8004 on the host machine and connected to port 3000 in the container.
- `Environment Variable`: PUPPETEER_SKIP_CHROMIUM_DOWNLOAD is set to true to use the pre-installed version of Chromium.
- `Volumes`:
  - `./images:/app/images`: Maps the local `images` directory to the container for storing screenshots or rendered images.
  - `./reports:/app/pdf`: Maps the local `reports` directory to the container for storing generated PDF files.
  - `./fonts:/usr/share/fonts/custom-fonts`: Maps a local `fonts` directory to the container, enabling the use of custom fonts.
