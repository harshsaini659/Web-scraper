# Web-scraper
The Web Scraper App is a Node.js application that extracts details from a website homepage. Users input a URL, and the app scrapes the site name, meta description, logo, social media URLs, address, phone number, and email, storing this information in a backend database for easy management.

## Features
- Scrapes essential information from the homepage of a given website.
- Extracted data includes site name, meta description, company logo, social media URLs, address, phone number, and email.
- Stores scraped data in a backend database.
- View, delete, and download scraped data as a CSV file.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Web Scraping**: Puppeteer, Cheerio
- **Database**: MongoDB, Mongoose

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/web-scraper-app.git
    cd web-scraper-app
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up MongoDB:**
    Make sure MongoDB is installed and running on your machine.

4. **Start the server:**
    ```sh
    mongod
    node src/index.js
    npm run dev
    ```
## API Endpoints

- `POST /api/records` - Scrapes and saves data from a given URL.
- `GET /api/records` - Retrieves all scraped records.
- `DELETE /api/records/:id` - Deletes a record by ID.
- `POST /api/records/delete-multiple` - Deletes multiple records by IDs.
- `GET /api/records/download` - Downloads all records as a CSV file.


