/* ============================================
   MEDIUM FEED INTEGRATION - TERMINAL THEME
   ============================================ */

// Medium username - Update this if your Medium username is different
const MEDIUM_USERNAME = '@imadouguahi';

// Function to fetch Medium posts
async function fetchMediumPosts() {
	try {
		const rssUrl = `https://medium.com/feed/${MEDIUM_USERNAME}`;
		const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
		
		const response = await fetch(apiUrl);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		
		if (data.status === 'ok' && data.items) {
			return data.items;
		} else {
			console.error('Medium API error:', data);
			return [];
		}
	} catch (error) {
		console.error('Error fetching Medium posts:', error);
		return [];
	}
}

// Function to format date in terminal style
function formatDate(dateString) {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = date.toLocaleString('en-US', { month: 'short' });
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	
	return `${day} ${month} ${year} ${hours}:${minutes}`;
}

// Function to extract first image from content
function getFirstImage(content) {
	if (!content) return null;
	
	const parser = new DOMParser();
	const doc = parser.parseFromString(content, 'text/html');
	const firstImage = doc.querySelector('img');
	
	if (firstImage && firstImage.src) {
		return firstImage.src;
	}
	
	return null;
}

// Function to extract excerpt from content
function getExcerpt(content, maxLength = 150) {
	if (!content) return 'No description available.';
	
	const parser = new DOMParser();
	const doc = parser.parseFromString(content, 'text/html');
	const text = doc.body.textContent || '';
	
	// Clean up text
	const cleaned = text.replace(/\s+/g, ' ').trim();
	
	if (cleaned.length <= maxLength) {
		return cleaned;
	}
	
	return cleaned.substring(0, maxLength) + '...';
}

// Function to render posts in terminal style
async function renderMediumPosts() {
	const loadingElement = document.getElementById('blog-loading');
	const postsContainer = document.getElementById('blog-posts');
	
	if (!postsContainer) {
		console.error('Blog posts container not found');
		return;
	}
	
	// Show loading state
	if (loadingElement) {
		loadingElement.style.display = 'block';
	}
	postsContainer.innerHTML = '';
	
	try {
		const posts = await fetchMediumPosts();
		
		// Hide loading
		if (loadingElement) {
			loadingElement.style.display = 'none';
		}
		
		if (!posts || posts.length === 0) {
			postsContainer.innerHTML = `
				<div class="terminal-window blog-post-empty">
					<div class="terminal-header">
						<div class="terminal-controls">
							<span class="control close"></span>
							<span class="control minimize"></span>
							<span class="control maximize"></span>
						</div>
						<div class="terminal-title">medium_feed.sh</div>
					</div>
					<div class="terminal-body">
						<div class="terminal-output">
							<div class="output-line">
								<span class="prompt-inline">user@portfolio:~/blog$</span> fetch_medium_posts.sh
							</div>
							<div class="error-message">
								<span class="error-prefix">[ERROR]</span>
								<span class="error-text">No posts found. Check your Medium username or try again later.</span>
							</div>
						</div>
					</div>
				</div>
			`;
			return;
		}
		
		// Limit to latest 6 posts
		const latestPosts = posts.slice(0, 6);
		
		// Render posts
		const postsHTML = latestPosts.map((post, index) => {
			const image = getFirstImage(post.content);
			const excerpt = getExcerpt(post.content, 200);
			const date = formatDate(post.pubDate);
			const postNumber = String(index + 1).padStart(2, '0');
			
			return `
				<div class="blog-post-card terminal-window">
					<div class="terminal-header">
						<div class="terminal-controls">
							<span class="control close"></span>
							<span class="control minimize"></span>
							<span class="control maximize"></span>
						</div>
						<div class="terminal-title">post_${postNumber}.md</div>
					</div>
					<div class="terminal-body">
						<div class="blog-post-content">
							${image ? `
								<div class="blog-post-image">
									<a href="${post.link}" target="_blank" rel="noopener noreferrer">
										<img src="${image}" alt="${post.title}" loading="lazy" />
									</a>
								</div>
							` : ''}
							<div class="blog-post-header">
								<div class="blog-post-date">
									<span class="date-prefix">[PUBLISHED]</span>
									<span class="date-value">${date}</span>
								</div>
								<h3 class="blog-post-title">
									<a href="${post.link}" target="_blank" rel="noopener noreferrer" class="blog-post-link">
										${post.title}
									</a>
								</h3>
							</div>
							<div class="blog-post-excerpt">
								${excerpt}
							</div>
							<div class="blog-post-footer">
								<a href="${post.link}" target="_blank" rel="noopener noreferrer" class="blog-post-read-more">
									<span class="read-more-prefix">></span>
									<span class="read-more-text">read_article.sh</span>
									<span class="read-more-icon">→</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			`;
		}).join('');
		
		postsContainer.innerHTML = postsHTML;
		
		// Add animation to posts
		const postCards = postsContainer.querySelectorAll('.blog-post-card');
		postCards.forEach((card, index) => {
			card.style.opacity = '0';
			card.style.transform = 'translateY(20px)';
			setTimeout(() => {
				card.style.transition = 'opacity 0.5s, transform 0.5s';
				card.style.opacity = '1';
				card.style.transform = 'translateY(0)';
			}, index * 100);
		});
		
	} catch (error) {
		console.error('Error rendering Medium posts:', error);
		
		if (loadingElement) {
			loadingElement.style.display = 'none';
		}
		
		postsContainer.innerHTML = `
			<div class="terminal-window blog-post-error">
				<div class="terminal-header">
					<div class="terminal-controls">
						<span class="control close"></span>
						<span class="control minimize"></span>
						<span class="control maximize"></span>
					</div>
					<div class="terminal-title">medium_feed.sh</div>
				</div>
				<div class="terminal-body">
					<div class="terminal-output">
						<div class="output-line">
							<span class="prompt-inline">user@portfolio:~/blog$</span> fetch_medium_posts.sh
						</div>
						<div class="error-message">
							<span class="error-prefix">[ERROR]</span>
							<span class="error-text">Failed to fetch posts. ${error.message}</span>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', renderMediumPosts);
} else {
	// DOM is already ready
	renderMediumPosts();
}

// Auto-refresh posts every 30 minutes (optional)
// setInterval(renderMediumPosts, 30 * 60 * 1000);
