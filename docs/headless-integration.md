# Step-by-Step Guide: Svelte SSG with Contentful and Local Caching

This guide walks you through setting up a Svelte SSG application with Contentful, fetching all site data into a global store, and implementing local caching during development to reduce API calls.

---

## 1. Set Up Contentful

1. **Create Content Types**:
	- **Navigation**: Define fields like `label` (string) and `url` (string).
	- **Services**: Fields might include `title`, `description`, `icon`, etc.
	- **Blog Posts**: Include fields like `title`, `content`, `slug`, `publishedDate`, etc.
	- **Pages**: Add fields like `title`, `slug`, and `content` for static pages.
	- **Footer**: For one-off content like footer data.

2. **Add Content**:
	- Populate each content type with sample data in the Contentful admin panel.

3. **Enable Public API Access**:
	- Navigate to **Settings → API Keys → Content delivery/preview tokens**.
	- Create a delivery access token for public data fetching.

---

## 2. Install Dependencies

1. **Install Contentful SDK**:
   ```bash
   npm install contentful
   ```

2. **Install Node.js Modules for Caching**:
	- If not already available, install `fs` (file system module, built-in) and `path` (built-in) for managing local cache files.

---

## 3. Create a Writable Store for Global Data

### **File: `src/lib/stores/siteDataStore.js`**
```javascript
import { writable } from 'svelte/store';
import { createClient } from 'contentful';
import fs from 'fs'; // Node.js file system module
import path from 'path';

// Initialize Contentful client
const client = createClient({
space: '<your_space_id>',
accessToken: '<your_access_token>',
});

// Writable store for global site data
export const siteData = writable({
navigation: [],
services: [],
blogPosts: [],
pages: [],
footer: {},
});

const cachePath = path.resolve('./src/cache/siteData.json');

export const fetchAllSiteData = async () => {
try {
// Check if cache exists and is valid
if (process.env.NODE_ENV === 'development' && fs.existsSync(cachePath)) {
console.log('Using cached site data');
const cachedData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
siteData.set(cachedData);
return;
}

    // Fetch fresh data from Contentful
    console.log('Fetching fresh site data from Contentful');
    const [navigation, services, blogPosts, pages, footer] = await Promise.all([
      client.getEntries({ content_type: 'navigation', order: 'fields.order' }),
      client.getEntries({ content_type: 'services' }),
      client.getEntries({ content_type: 'blogPost', order: '-fields.publishedDate' }),
      client.getEntries({ content_type: 'page' }),
      client.getEntries({ content_type: 'footer' }),
    ]);

    const freshData = {
      navigation: navigation.items,
      services: services.items,
      blogPosts: blogPosts.items,
      pages: pages.items,
      footer: footer.items.length > 0 ? footer.items[0].fields : {},
    };

    // Save fresh data to cache (only in development)
    if (process.env.NODE_ENV === 'development') {
      fs.writeFileSync(cachePath, JSON.stringify(freshData, null, 2));
      console.log('Cached site data locally');
    }

    // Update the store with fresh data
    siteData.set(freshData);
} catch (err) {
console.error('Error fetching site data:', err);
siteData.set({
navigation: [],
services: [],
blogPosts: [],
pages: [],
footer: {},
});
}
};
```

---

## 4. Fetch Data in the Root Layout

### **File: `src/routes/+layout.js`**
```javascript
import { fetchAllSiteData } from '$lib/stores/siteDataStore.js';

export const prerender = true; // Ensure the site is statically generated

export async function load() {
await fetchAllSiteData(); // Fetch all data at build time
return {}; // Data will be accessed via the store
}
```

---

## 5. Use Data in Components

### **Example: Navigation Component**

```svelte
<script>
  import { siteData } from '$lib/stores/siteDataStore.js';
</script>

<nav>
  <ul>
    {#each $siteData.navigation as item}
      <li><a href={item.fields.url}>{item.fields.label}</a></li>
    {/each}
  </ul>
</nav>
```

### **Example: Footer Component**

```svelte
<script>
  import { siteData } from '$lib/stores/siteDataStore.js';
</script>

<footer>
  <p>{$siteData.footer.copyrightText}</p>
  <ul>
    {#each $siteData.footer.socialLinks as link}
      <li><a href={link.url} target="_blank">{link.label}</a></li>
    {/each}
  </ul>
</footer>
```

---

## 6. Clear the Cache (Optional)

### **File: `scripts/clearCache.js`**
```javascript
const fs = require('fs');
const path = require('path');

const cachePath = path.resolve('./src/cache/siteData.json');

if (fs.existsSync(cachePath)) {
fs.unlinkSync(cachePath);
console.log('Cache cleared!');
} else {
console.log('No cache file to delete.');
}
```

Run the script to clear the cache:
```bash
node scripts/clearCache.js
```

---

## Summary

- Fetch all site data in one global store during the build process.
- Use cached data during development to reduce API calls.
- Clear the cache whenever you need fresh data.

This approach keeps API usage low while speeding up development.
