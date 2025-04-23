// Function to fetch Medium posts
async function fetchMediumPosts() {
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@imadouguahi`);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching Medium posts:', error);
        return [];
    }
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to extract first image from content
function getFirstImage(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const firstImage = doc.querySelector('img');
    return firstImage ? firstImage.src : 'images/blog/blog1.jpg';
}

// Function to render posts
async function renderMediumPosts() {
    const posts = await fetchMediumPosts();
    const container = document.querySelector('.blog-items');
    
    if (!posts.length) {
        container.innerHTML = '<div class="blog-item"><p>No posts found</p></div>';
        return;
    }

    const postsHTML = posts.map(post => `
        <div class="blog-item">
            <div class="content">
                <div class="date">${formatDate(post.pubDate)}</div>
                <a href="${post.link}" target="_blank" class="title">
                    <div class="title_inner">${post.title}</div>
                </a>
            </div>
            <div class="image">
                <a href="${post.link}" target="_blank">
                    <img src="${getFirstImage(post.content)}" alt="${post.title}" />
                </a>
            </div>
        </div>
    `).join('');

    container.innerHTML = postsHTML;
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', renderMediumPosts); 