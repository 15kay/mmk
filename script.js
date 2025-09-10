// Global variables
let likeCount = 42;
let isFollowing = false;
let commentsVisible = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeAnimations();
    initializeProfileImage();

    initializeTypingEffect();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Animation initialization
function initializeAnimations() {
    // Add fade-in animation to elements
    const animatedElements = document.querySelectorAll('.profile-card, .welcome-post, .widget');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Profile image interaction
function initializeProfileImage() {
    const profileImg = document.getElementById('profileImg');
    if (profileImg) {
        profileImg.addEventListener('click', function () {
            showImageModal();
        });
    }
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const msg = input.value.trim();
    if (!msg) return;

    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML += `<div class="user"><b>You:</b> ${msg}</div>`;

    input.value = "";

    try {
        const response = await fetch("https://mmk-agent.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: msg
            })
        });


        const data = await response.json();
        messagesDiv.innerHTML += `<div class="bot"><b>Bot:</b> ${data.reply}</div>`;
    } catch (error) {
        messagesDiv.innerHTML += `<div class="bot"><b>Bot:</b> Sorry, I couldn't reach the server.</div>`;
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
// Like post functionality
function likePost(button) {
    const heartIcon = button.querySelector('i');
    const likeCountSpan = button.querySelector('.like-count');

    if (heartIcon.classList.contains('far')) {
        // Like the post
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        button.classList.add('liked');
        likeCount++;

        // Add animation
        heartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            heartIcon.style.transform = 'scale(1)';
        }, 200);

        showNotification('Post liked! ❤️');
    } else {
        // Unlike the post
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        button.classList.remove('liked');
        likeCount--;

        showNotification('Post unliked');
    }

    if (likeCountSpan) {
        likeCountSpan.textContent = likeCount;
    }
}

// Follow user functionality
function followUser() {
    const followBtn = document.querySelector('.btn-secondary');

    if (!isFollowing) {
        followBtn.textContent = 'Following';
        followBtn.style.background = '#4CAF50';
        followBtn.style.color = 'white';
        followBtn.style.borderColor = '#4CAF50';
        isFollowing = true;
        showNotification('Now following Kgaugelo! 🎉');
    } else {
        followBtn.textContent = 'Follow';
        followBtn.style.background = '#f8f9fa';
        followBtn.style.color = '#333';
        followBtn.style.borderColor = '#667eea';
        isFollowing = false;
        showNotification('Unfollowed');
    }
}

// Send message functionality
function sendMessage() {
    showModal('Send Message', `
        <form id="messageForm">
            <div class="form-group">
                <label for="messageSubject">Subject:</label>
                <input type="text" id="messageSubject" placeholder="Enter subject..." required>
            </div>
            <div class="form-group">
                <label for="messageContent">Message:</label>
                <textarea id="messageContent" placeholder="Type your message..." required></textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Send Message</button>
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);

    document.getElementById('messageForm').addEventListener('submit', function (e) {
        e.preventDefault();
        showNotification('Message sent successfully! 📧');
        closeModal();
    });
}

// Share profile functionality
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: 'Kgaugelo Mmakola - Data Scientist & Software Engineer',
            text: 'Check out this amazing portfolio!',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        copyToClipboard(window.location.href);
        showNotification('Profile link copied to clipboard! 📋');
    }
}

// Share post functionality
function sharePost() {
    const shareOptions = [
        {
            name: 'Copy Link', action: () => {
                copyToClipboard(window.location.href);
                showNotification('Link copied to clipboard! 📋');
            }
        },
        {
            name: 'Twitter', action: () => {
                window.open(`https://twitter.com/intent/tweet?text=Check out this amazing portfolio!&url=${encodeURIComponent(window.location.href)}`);
            }
        },
        {
            name: 'LinkedIn', action: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`);
            }
        },
        {
            name: 'Facebook', action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
            }
        }
    ];

    const shareMenu = shareOptions.map(option =>
        `<button class="share-option" onclick="${option.action.toString().slice(6, -1)}; closeModal();">${option.name}</button>`
    ).join('');

    showModal('Share Post', `<div class="share-menu">${shareMenu}</div>`);
}

// Toggle comments functionality
function toggleComments() {
    const commentsSection = document.getElementById('commentsSection');

    if (!commentsSection) {
        // Create comments section if it doesn't exist
        const welcomePost = document.querySelector('.welcome-post');
        const commentsHTML = `
            <div id="commentsSection" class="comments-section" style="display: none;">
                <div class="comment">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=30&h=30&fit=crop&auto=format&crop=face" alt="User">
                    <div class="comment-content">
                        <strong>Alex Johnson</strong>
                        <p>Amazing work! Your AI projects are really impressive. 🚀</p>
                        <small>2 hours ago</small>
                    </div>
                </div>
                <div class="comment">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop&auto=format&crop=face" alt="User">
                    <div class="comment-content">
                        <strong>Sarah Chen</strong>
                        <p>Love your approach to data science! Keep up the great work.</p>
                        <small>5 hours ago</small>
                    </div>
                </div>
                <div class="comment-form">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&h=30&fit=crop&auto=format&crop=face" alt="You">
                    <input type="text" placeholder="Write a comment..." onkeypress="handleCommentSubmit(event)">
                </div>
            </div>
        `;
        welcomePost.insertAdjacentHTML('beforeend', commentsHTML);
    }

    const comments = document.getElementById('commentsSection');
    if (commentsVisible) {
        comments.style.display = 'none';
        commentsVisible = false;
    } else {
        comments.style.display = 'block';
        commentsVisible = true;
    }
}

// Handle comment submission
function handleCommentSubmit(event) {
    if (event.key === 'Enter' && event.target.value.trim()) {
        const comment = event.target.value.trim();
        addComment('You', comment);
        event.target.value = '';
        showNotification('Comment added! 💬');
    }
}

// Add new comment
function addComment(author, text) {
    const commentsSection = document.getElementById('commentsSection');
    const commentForm = commentsSection.querySelector('.comment-form');

    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.innerHTML = `
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&auto=format&crop=face" alt="${author}">
        <div class="comment-content">
            <strong>${author}</strong>
            <p>${text}</p>
            <small>Just now</small>
        </div>
    `;

    commentsSection.insertBefore(newComment, commentForm);
}

// Utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    const colors = {
        success: 'linear-gradient(45deg, #667eea, #764ba2)',
        error: 'linear-gradient(45deg, #f44336, #d32f2f)',
        warning: 'linear-gradient(45deg, #FF9800, #F57C00)',
        info: 'linear-gradient(45deg, #2196F3, #1976D2)'
    };

    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type] || icons.success}"></i>
            <span>${message}</span>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    document.body.appendChild(notification);

    // Remove notification after different durations based on type
    const duration = type === 'error' ? 6000 : type === 'warning' ? 5000 : 3000;
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Modal functionality
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

// Image modal
function showImageModal() {
    const profileImg = document.getElementById('profileImg');
    const imgSrc = profileImg.src;

    showModal('Profile Picture', `
        <div class="image-modal">
            <img src="${imgSrc}" alt="Profile Picture" style="max-width: 100%; border-radius: 10px;">
            <p style="text-align: center; margin-top: 15px; color: #666;">Kgaugelo Mmakola</p>
        </div>
    `);
}



// Typing effect for welcome message
function initializeTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');

    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };

        typeWriter();
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// EmailJS Configuration

const EMAILJS_CONFIG = {
    serviceID: 'service_ryc632c', // Replace with your EmailJS service ID
    templateID: 'template_fse1e6b', // Replace with your EmailJS template ID
    publicKey: 'Cv8L2o22hOloH4ILu'    // Replace with your EmailJS public key
};

// Example EmailJS template:
// Subject: New Contact from {{from_name}} - {{subject}}
// Body: 
// Name: {{from_name}}
// Email: {{from_email}}
// Subject: {{subject}}
// 
// Message:
// {{message}}
// 
// ---
// Sent from your portfolio website

// Initialize EmailJS
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
}

// Contact form functionality with EmailJS
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject') || 'Portfolio Contact';
            const message = formData.get('message');

            // Validate required fields
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields! ⚠️', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.innerHTML = '<div class="loading"></div> Sending...';
            submitBtn.disabled = true;

            // Check if EmailJS is available
            if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
                // Send actual email via EmailJS
                const templateParams = {
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message,
                    to_name: 'Kgaugelo' // Your name
                };

                emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
                    .then(function (response) {
                        console.log('Email sent successfully:', response);
                        showNotification(`Thank you ${name}! Your message has been sent successfully. 📧`);
                        contactForm.reset();
                    })
                    .catch(function (error) {
                        console.error('Email sending failed:', error);
                        showNotification('Sorry, there was an error sending your message. Please try again. ❌', 'error');
                    })
                    .finally(function () {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    });
            } else {
                // Fallback: Show configuration message
                setTimeout(() => {
                    showNotification(`Thank you ${name}! Email service is not configured yet. Please contact directly via social media. 📧`, 'warning');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }
}

// Initialize contact form and EmailJS when page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeEmailJS();
    initializeContactForm();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .modal-content {
        background: white;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .share-menu {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .share-option {
        padding: 12px;
        border: none;
        background: #f8f9fa;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .share-option:hover {
        background: #667eea;
        color: white;
    }
    
    .comments-section {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }
    
    .comment {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .comment img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }
    
    .comment-content {
        flex: 1;
    }
    
    .comment-content strong {
        color: #333;
        font-size: 0.9rem;
    }
    
    .comment-content p {
        margin: 5px 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .comment-content small {
        color: #999;
        font-size: 0.8rem;
    }
    
    .comment-form {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: 15px;
    }
    
    .comment-form input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
    }
    
    .comment-form input:focus {
        border-color: #667eea;
    }
    

`;
document.head.appendChild(style);

// Additional button functionality
function downloadResume() {
    // Show modal with CV download protection information
    showModal('🔒 CV Download Protection', `
        <div class="cv-protection-modal">
            <div class="protection-icon" style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-shield-alt" style="font-size: 3rem; color: #FF9800;"></i>
            </div>
            <div class="protection-message" style="text-align: center; margin-bottom: 25px;">
                <h3 style="color: #FF9800; margin-bottom: 15px;">Access Restricted</h3>
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">
                    CV downloads are restricted to <strong>recruiters only</strong>.
                </p>
                <p style="color: #666; margin-bottom: 25px;">
                    Please contact me directly for access to my complete CV and portfolio materials.
                </p>
            </div>
            <div class="contact-options" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="contactForCV()" style="min-width: 150px;">
                    <i class="fas fa-envelope"></i> Contact Me
                </button>
                <button class="btn btn-outline" onclick="viewOnlineProfile()" style="min-width: 150px;">
                    <i class="fas fa-user"></i> View Online Profile
                </button>
            </div>
            <div class="security-note" style="margin-top: 25px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #FF9800;">
                <small style="color: #666;">
                    <i class="fas fa-info-circle"></i> 
                    This protection helps maintain privacy and ensures CV access is granted to legitimate recruitment inquiries only.
                </small>
            </div>
        </div>
    `);

    // Also show the warning notification
    setTimeout(() => {
        showNotification('⚠️ CV downloads are restricted to recruiters only. Please contact me directly for access.', 'warning');
    }, 500);
}

function contactForCV() {
    closeModal();
    // Navigate to contact page and pre-fill for CV request
    const contactSection = document.querySelector('.contact-form-section');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const subjectField = document.getElementById('subject');
            const messageField = document.getElementById('message');
            if (subjectField) subjectField.value = 'recruitment';
            if (messageField) {
                messageField.value = 'Hi Kgaugelo,\n\nI am a recruiter interested in reviewing your CV for potential opportunities. Could you please provide access to your complete CV?\n\nBest regards,';
                messageField.focus();
            }
        }, 500);
    }
}

function viewOnlineProfile() {
    closeModal();
    showNotification('📄 You can view my complete online profile and projects on this website!', 'info');
    // Scroll to top to show the profile section
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scheduleCall() {
    showModal('📅 Schedule a 30-Minute Chat', `
        <div class="schedule-modal">
            <div class="schedule-header">
                <h4>Book a 30-minute conversation</h4>
                <p>Let's discuss your project, collaboration opportunities, or just have a friendly chat about tech!</p>
            </div>
            
            <div class="schedule-tabs">
                <button class="tab-btn active" onclick="showScheduleTab('calendar')">
                    <i class="fas fa-calendar-alt"></i> Calendar Booking
                </button>
                <button class="tab-btn" onclick="showScheduleTab('email')">
                    <i class="fas fa-envelope"></i> Email Request
                </button>
            </div>
            
            <div id="calendar-tab" class="schedule-tab active">
                <div class="calendar-booking">
                    <div class="time-zone-info">
                        <i class="fas fa-clock"></i> 
                        <span>South Africa Standard Time (SAST) - UTC+2</span>
                    </div>
                    
                    <div class="available-slots">
                        <h5>Available This Week:</h5>
                        <div class="slots-grid">
                            <div class="slot-item" onclick="selectTimeSlot(this, 'Monday 2 PM - 2:30 PM')">
                                <div class="slot-day">Monday</div>
                                <div class="slot-time">2:00 PM - 2:30 PM</div>
                                <div class="slot-status available">Available</div>
                            </div>
                            <div class="slot-item" onclick="selectTimeSlot(this, 'Tuesday 10 AM - 10:30 AM')">
                                <div class="slot-day">Tuesday</div>
                                <div class="slot-time">10:00 AM - 10:30 AM</div>
                                <div class="slot-status available">Available</div>
                            </div>
                            <div class="slot-item" onclick="selectTimeSlot(this, 'Wednesday 3 PM - 3:30 PM')">
                                <div class="slot-day">Wednesday</div>
                                <div class="slot-time">3:00 PM - 3:30 PM</div>
                                <div class="slot-status available">Available</div>
                            </div>
                            <div class="slot-item" onclick="selectTimeSlot(this, 'Thursday 11 AM - 11:30 AM')">
                                <div class="slot-day">Thursday</div>
                                <div class="slot-time">11:00 AM - 11:30 AM</div>
                                <div class="slot-status available">Available</div>
                            </div>
                            <div class="slot-item" onclick="selectTimeSlot(this, 'Friday 1 PM - 1:30 PM')">
                                <div class="slot-day">Friday</div>
                                <div class="slot-time">1:00 PM - 1:30 PM</div>
                                <div class="slot-status available">Available</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="meeting-options">
                        <h5>Meeting Preference:</h5>
                        <div class="meeting-types">
                            <label class="meeting-option">
                                <input type="radio" name="meetingType" value="video" checked>
                                <i class="fas fa-video"></i> Video Call (Google Meet)
                            </label>
                            <label class="meeting-option">
                                <input type="radio" name="meetingType" value="phone">
                                <i class="fas fa-phone"></i> Phone Call
                            </label>
                            <label class="meeting-option">
                                <input type="radio" name="meetingType" value="inperson">
                                <i class="fas fa-handshake"></i> In-Person (Johannesburg)
                            </label>
                        </div>
                    </div>
                    
                    <div class="booking-form">
                        <input type="text" id="bookerName" placeholder="Your Name" required>
                        <input type="email" id="bookerEmail" placeholder="Your Email" required>
                        <textarea id="meetingPurpose" placeholder="What would you like to discuss? (Optional)" rows="3"></textarea>
                        
                        <button class="btn btn-primary" onclick="confirmBooking()" disabled id="bookingBtn">
                            <i class="fas fa-calendar-check"></i> Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="email-tab" class="schedule-tab">
                <div class="email-booking">
                    <p>Prefer to schedule via email? I'll get back to you within 24 hours with available times.</p>
                    <button class="btn btn-outline" onclick="contactForCall()" style="width: 100%; margin-top: 15px;">
                        <i class="fas fa-envelope"></i> Send Scheduling Email
                    </button>
                </div>
            </div>
            
            <div class="schedule-footer">
                <small>
                    <i class="fas fa-info-circle"></i> 
                    All meetings are conducted in English. You'll receive a confirmation email with meeting details.
                </small>
            </div>
        </div>
    `);

    // Add event listeners for form validation
    setTimeout(() => {
        const nameInput = document.getElementById('bookerName');
        const emailInput = document.getElementById('bookerEmail');
        const bookingBtn = document.getElementById('bookingBtn');

        function validateForm() {
            const isValid = nameInput.value.trim() && emailInput.value.trim() && document.querySelector('.slot-item.selected');
            bookingBtn.disabled = !isValid;
        }

        if (nameInput && emailInput) {
            nameInput.addEventListener('input', validateForm);
            emailInput.addEventListener('input', validateForm);
        }
    }, 100);
}

function viewPortfolio() {
    window.location.href = 'projects.html';
}

// Schedule system functions
function showScheduleTab(tabName) {
    // Remove active class from all tabs and tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.schedule-tab').forEach(tab => tab.classList.remove('active'));

    // Add active class to selected tab and button
    document.querySelector(`[onclick="showScheduleTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function selectTimeSlot(element, timeSlot) {
    // Remove selection from all slots
    document.querySelectorAll('.slot-item').forEach(slot => slot.classList.remove('selected'));

    // Add selection to clicked slot
    element.classList.add('selected');

    // Store selected time slot
    element.dataset.selectedTime = timeSlot;

    // Trigger form validation
    const nameInput = document.getElementById('bookerName');
    const emailInput = document.getElementById('bookerEmail');
    const bookingBtn = document.getElementById('bookingBtn');

    if (nameInput && emailInput && bookingBtn) {
        const isValid = nameInput.value.trim() && emailInput.value.trim();
        bookingBtn.disabled = !isValid;
    }
}

function confirmBooking() {
    const selectedSlot = document.querySelector('.slot-item.selected');
    const name = document.getElementById('bookerName').value.trim();
    const email = document.getElementById('bookerEmail').value.trim();
    const purpose = document.getElementById('meetingPurpose').value.trim();
    const meetingType = document.querySelector('input[name="meetingType"]:checked').value;

    if (!selectedSlot || !name || !email) {
        showNotification('Please fill in all required fields and select a time slot! ⚠️', 'error');
        return;
    }

    const timeSlot = selectedSlot.dataset.selectedTime;
    const meetingTypeText = {
        'video': 'Video Call (Google Meet)',
        'phone': 'Phone Call',
        'inperson': 'In-Person Meeting (Johannesburg)'
    };

    // Simulate booking confirmation
    const bookingBtn = document.getElementById('bookingBtn');
    const originalText = bookingBtn.innerHTML;

    bookingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    bookingBtn.disabled = true;

    setTimeout(() => {
        closeModal();

        // Show success notification
        showNotification(`🎉 Meeting booked successfully! You'll receive a confirmation email shortly.`, 'success');

        // Simulate sending confirmation email
        setTimeout(() => {
            showNotification(`📧 Confirmation email sent to ${email}`, 'info');
        }, 2000);

        // Log booking details (in real implementation, this would be sent to a backend)
        console.log('Booking Details:', {
            name,
            email,
            timeSlot,
            meetingType: meetingTypeText[meetingType],
            purpose: purpose || 'General discussion',
            bookedAt: new Date().toISOString()
        });

        // Optional: Navigate to contact form for follow-up
        setTimeout(() => {
            const contactSection = document.querySelector('.contact-form-section');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                const messageField = document.getElementById('message');
                if (messageField) {
                    messageField.value = `Hi Kgaugelo,\n\nI just booked a ${meetingTypeText[meetingType].toLowerCase()} for ${timeSlot}. Looking forward to our conversation!\n\n${purpose ? `Discussion topic: ${purpose}\n\n` : ''}Best regards,\n${name}`;
                }
            }
        }, 3000);

    }, 2000);
}

function openCalendly() {
    showNotification('📅 Calendar booking system integration coming soon! Please email me to schedule.');
    closeModal();
}

function contactForCall() {
    closeModal();
    // Scroll to contact form and pre-fill
    const contactSection = document.querySelector('.contact-form-section');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const subjectField = document.getElementById('subject');
            const messageField = document.getElementById('message');
            if (subjectField) subjectField.value = 'collaboration';
            if (messageField) {
                messageField.value = 'Hi Kgaugelo,\n\nI would like to schedule a call to discuss potential opportunities. Please let me know your availability.\n\nBest regards,';
                messageField.focus();
            }
        }, 500);
    }
}

function discussCollaboration(type) {
    const subjects = {
        'opensource': 'Open Source Collaboration',
        'speaking': 'Speaking Engagement',
        'consulting': 'Consulting Inquiry'
    };

    const contactSection = document.querySelector('.contact-form-section');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const subjectField = document.getElementById('subject');
            const messageField = document.getElementById('message');
            if (subjectField) subjectField.value = 'collaboration';
            if (messageField) {
                messageField.value = `Hi Kgaugelo,\n\nI'm interested in discussing ${subjects[type]} opportunities. `;
                messageField.focus();
            }
        }, 500);
    }
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('i');

    faqItem.classList.toggle('active');

    if (faqItem.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    } else {
        answer.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    }
}

function viewProjectDetails(projectId) {
    const projectDetails = {
        'financial-advisor': {
            title: 'Financial Advisor System',
            description: 'A comprehensive AI-powered financial planning assistant that provides personalized investment recommendations and market analysis.',
            technologies: ['Python', 'TensorFlow', 'Django', 'PostgreSQL', 'Chart.js'],
            features: [
                'Real-time market data integration',
                'Machine learning prediction models',
                'Risk assessment algorithms',
                'Portfolio optimization',
                'Interactive dashboards'
            ],
            status: 'Completed',
            github: 'https://github.com/15kay/financial-advisor'
        },
        'education-platform': {
            title: 'AI Education Platform',
            description: 'An intelligent learning platform that adapts to student needs and provides personalized educational content.',
            technologies: ['Python', 'Flask', 'React', 'MongoDB', 'TensorFlow'],
            features: [
                'Adaptive learning algorithms',
                'Progress tracking',
                'Interactive content delivery',
                'Student analytics',
                'Teacher dashboard'
            ],
            status: 'In Development',
            github: 'https://github.com/15kay/ai-education'
        },
        'nasdaq-prediction': {
            title: 'NASDAQ Prediction Model',
            description: 'Machine learning model for predicting NASDAQ stock movements using historical data and market indicators.',
            technologies: ['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Matplotlib'],
            features: [
                'Time series analysis',
                'Real-time data processing',
                'Risk assessment algorithms',
                'Backtesting and validation'
            ],
            status: 'Completed',
            github: 'https://github.com/15kay/nasdaq-prediction'
        },
        'employment-tracking': {
            title: 'Student Employment Tracking System',
            description: 'AI-driven system designed to track student learning progress and employment outcomes.',
            technologies: ['Python', 'Django', 'PostgreSQL', 'AWS', 'React'],
            features: [
                'Student progress tracking',
                'Employment outcome analysis',
                'Skills gap identification',
                'Career path recommendations',
                'Industry partnership integration'
            ],
            status: 'Planning',
            github: null
        }
    };

    const project = projectDetails[projectId];
    if (project) {
        const featuresHtml = project.features.map(feature => `<li>${feature}</li>`).join('');
        const techHtml = project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
        const githubLink = project.github ? `<a href="${project.github}" target="_blank" class="btn btn-outline" style="margin-top: 15px;"><i class="fab fa-github"></i> View on GitHub</a>` : '<p style="color: #666; margin-top: 15px;">Repository coming soon...</p>';

        showModal(project.title, `
            <div class="project-details">
                <div class="project-status-badge" style="background: ${project.status === 'Completed' ? '#4CAF50' : project.status === 'In Development' ? '#FF9800' : '#2196F3'}; color: white; padding: 5px 15px; border-radius: 15px; display: inline-block; margin-bottom: 15px;">
                    ${project.status}
                </div>
                <p style="margin-bottom: 20px; line-height: 1.6;">${project.description}</p>
                
                <h4 style="margin-bottom: 10px;">Key Features:</h4>
                <ul style="margin-bottom: 20px; padding-left: 20px;">${featuresHtml}</ul>
                
                <h4 style="margin-bottom: 10px;">Technologies Used:</h4>
                <div style="margin-bottom: 20px;">${techHtml}</div>
                
                ${githubLink}
            </div>
        `);
    }
}

function shareProject(projectName) {
    if (navigator.share) {
        navigator.share({
            title: projectName,
            text: `Check out this project: ${projectName}`,
            url: window.location.href
        });
    } else {
        copyToClipboard(window.location.href);
        showNotification(`${projectName} link copied to clipboard! 📋`);
    }
}



// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .tech-tag {
        background: #667eea;
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        margin: 2px;
        display: inline-block;
    }
`;
document.head.appendChild(notificationStyles);

// Chatbot Functionality
// AI Intelligence and Vector Search System
class AIIntelligence {
    constructor() {
        this.knowledgeBase = [
            // About & Professional Identity
            {
                id: 'about_kgaugelo',
                content: 'Kgaugelo Mmakola AI ML Engineer Full-Stack Developer South Africa machine learning data science web development passionate innovative problem solver creative thinker',
                response: "Mr. Kgaugelo Mmakola is a distinguished AI/ML Engineer and Full-Stack Developer based in South Africa, specializing in advanced machine learning solutions, data science methodologies, and enterprise-grade web development. He's known for his innovative approach to problem-solving and creative thinking in technology solutions.",
                category: 'about',
                embedding: null
            },
            {
                id: 'professional_background',
                content: 'professional experience software development career journey technology industry expertise years experience growth learning',
                response: "With extensive experience in the technology industry, Mr. Mmakola has built a robust professional background spanning software development, AI/ML engineering, and full-stack development. His career journey reflects continuous growth and adaptation to emerging technologies.",
                category: 'about',
                embedding: null
            },
            {
                id: 'work_philosophy',
                content: 'work philosophy approach methodology clean code best practices user experience collaboration teamwork agile development',
                response: "Mr. Mmakola's work philosophy centers on writing clean, maintainable code while following industry best practices. He emphasizes user experience, collaborative teamwork, and agile development methodologies to deliver exceptional results.",
                category: 'about',
                embedding: null
            },

            // Technical Skills - Programming Languages
            {
                id: 'programming_languages',
                content: 'Python JavaScript TypeScript Dart Java C++ programming languages syntax algorithms data structures object oriented functional programming',
                response: "Mr. Mmakola is proficient in multiple programming languages including Python for AI/ML and backend development, JavaScript/TypeScript for web applications, Dart for Flutter development, and has experience with Java and C++ for various specialized applications.",
                category: 'skills',
                embedding: null
            },
            {
                id: 'frontend_technologies',
                content: 'React Vue Angular HTML CSS JavaScript TypeScript responsive design UI UX frameworks libraries modern web development',
                response: "Frontend expertise includes React, Vue.js, and Angular frameworks, along with modern HTML5, CSS3, and JavaScript/TypeScript. He specializes in creating responsive, user-friendly interfaces with excellent UI/UX design principles.",
                category: 'skills',
                embedding: null
            },
            {
                id: 'backend_technologies',
                content: 'Node.js Express Django Flask FastAPI REST API GraphQL microservices architecture database design server development',
                response: "Backend development skills encompass Node.js with Express, Python frameworks like Django and Flask, FastAPI for high-performance APIs, and expertise in RESTful services, GraphQL, and microservices architecture.",
                category: 'skills',
                embedding: null
            },
            {
                id: 'mobile_development',
                content: 'Flutter Dart React Native mobile applications iOS Android cross platform development native performance user interface',
                response: "Mobile development expertise includes Flutter with Dart for cross-platform applications, React Native for JavaScript-based mobile solutions, ensuring native performance and excellent user interfaces across iOS and Android platforms.",
                category: 'skills',
                embedding: null
            },

            // AI/ML Expertise
            {
                id: 'machine_learning',
                content: 'machine learning algorithms supervised unsupervised reinforcement learning neural networks deep learning TensorFlow PyTorch scikit-learn',
                response: "Comprehensive machine learning expertise includes supervised and unsupervised learning algorithms, reinforcement learning, neural networks, and deep learning implementations using TensorFlow, PyTorch, and scikit-learn.",
                category: 'skills',
                embedding: null
            },
            {
                id: 'ai_specializations',
                content: 'computer vision natural language processing NLP image recognition text analysis sentiment analysis predictive modeling data mining',
                response: "AI specializations include computer vision for image recognition and analysis, natural language processing for text analysis and sentiment analysis, predictive modeling, and advanced data mining techniques.",
                category: 'skills',
                embedding: null
            },
            {
                id: 'data_science',
                content: 'data science analytics visualization pandas numpy matplotlib seaborn plotly statistical analysis big data processing',
                response: "Data science capabilities include comprehensive analytics and visualization using pandas, numpy, matplotlib, seaborn, and plotly. Experienced in statistical analysis, big data processing, and transforming complex datasets into actionable insights.",
                category: 'skills',
                embedding: null
            },

            // Cloud & DevOps
            {
                id: 'cloud_platforms',
                content: 'AWS Google Cloud Platform Azure cloud computing deployment scaling containerization Docker Kubernetes serverless',
                response: "Cloud expertise spans AWS, Google Cloud Platform, and Azure, with experience in cloud deployment, auto-scaling, containerization using Docker and Kubernetes, and serverless architecture implementations.",
                category: 'skills',
                embedding: null
            },
            {
                id: 'devops_tools',
                content: 'DevOps CI CD Git GitHub GitLab Jenkins automation testing deployment monitoring infrastructure as code',
                response: "DevOps proficiency includes CI/CD pipeline implementation, Git version control with GitHub/GitLab, Jenkins automation, comprehensive testing strategies, deployment automation, and infrastructure as code practices.",
                category: 'skills',
                embedding: null
            },

            // Database Technologies
            {
                id: 'databases',
                content: 'MySQL PostgreSQL MongoDB Redis Firebase database design optimization queries indexing data modeling relational NoSQL',
                response: "Database expertise includes relational databases like MySQL and PostgreSQL, NoSQL solutions like MongoDB and Redis, Firebase for real-time applications, with strong skills in database design, optimization, and data modeling.",
                category: 'skills',
                embedding: null
            },

            // Project Categories
            {
                id: 'web_applications',
                content: 'web applications e-commerce platforms content management systems social media applications business tools responsive design',
                response: "Web application portfolio includes sophisticated e-commerce platforms with payment integration, content management systems, social media applications, and custom business tools, all featuring responsive design and modern user experiences.",
                category: 'projects',
                embedding: null
            },
            {
                id: 'ai_projects',
                content: 'AI projects machine learning models predictive analytics computer vision NLP chatbots recommendation systems automation',
                response: "AI project portfolio showcases machine learning models for predictive analytics, computer vision applications, NLP-powered chatbots, intelligent recommendation systems, and automation solutions that solve real-world business challenges.",
                category: 'projects',
                embedding: null
            },
            {
                id: 'mobile_projects',
                content: 'mobile applications Flutter React Native iOS Android cross platform user experience performance optimization',
                response: "Mobile application projects demonstrate expertise in Flutter and React Native development, creating cross-platform solutions for iOS and Android with focus on exceptional user experience and performance optimization.",
                category: 'projects',
                embedding: null
            },
            {
                id: 'data_projects',
                content: 'data visualization dashboards business intelligence analytics reports interactive charts real-time monitoring',
                response: "Data visualization projects include interactive dashboards for business intelligence, comprehensive analytics reports, real-time monitoring systems, and dynamic charts that transform complex data into clear, actionable insights.",
                category: 'projects',
                embedding: null
            },

            // Professional Services
            {
                id: 'consulting_services',
                content: 'consulting technical consulting AI implementation digital transformation technology strategy architecture design code review',
                response: "Consulting services include technical consulting for AI implementation, digital transformation strategies, technology architecture design, code review and optimization, and strategic guidance for technology adoption.",
                category: 'services',
                embedding: null
            },
            {
                id: 'development_services',
                content: 'custom development full-stack development mobile app development AI solutions web applications enterprise software',
                response: "Development services encompass custom full-stack development, mobile application creation, AI solution implementation, responsive web applications, and enterprise software development tailored to specific business needs.",
                category: 'services',
                embedding: null
            },

            // Contact & Collaboration
            {
                id: 'contact_information',
                content: 'contact email kg.mmakola@outlook.com LinkedIn GitHub networking collaboration career opportunities consulting partnerships',
                response: "For professional inquiries, Mr. Mmakola can be reached via email at kg.mmakola@outlook.com. He maintains active professional profiles on LinkedIn and GitHub for networking, collaboration, and showcasing his latest work.",
                category: 'contact',
                embedding: null
            },
            {
                id: 'collaboration_opportunities',
                content: 'collaboration opportunities freelance projects full-time positions consulting partnerships open source contributions mentoring',
                response: "Mr. Mmakola is open to various collaboration opportunities including freelance projects, full-time positions, consulting partnerships, open source contributions, and mentoring aspiring developers in AI/ML and full-stack development.",
                category: 'contact',
                embedding: null
            },

            // Education & Learning
            {
                id: 'education_background',
                content: 'education academic studies computer science degree university continuous learning certifications online courses technology',
                response: "Educational foundation includes formal computer science studies complemented by continuous learning through certifications, online courses, and staying current with rapidly evolving technology trends and industry best practices.",
                category: 'education',
                embedding: null
            },
            {
                id: 'learning_approach',
                content: 'learning approach continuous improvement skill development technology trends research experimentation hands-on practice',
                response: "Learning approach emphasizes continuous improvement through hands-on practice, experimentation with new technologies, research into emerging trends, and practical application of theoretical knowledge in real-world projects.",
                category: 'education',
                embedding: null
            },

            // Personal Interests
            {
                id: 'hobbies_interests',
                content: 'hobbies photography digital art fitness music production outdoor activities technology community conferences workshops',
                response: "Personal interests include photography and digital artistry for creative expression, fitness and outdoor activities for well-being, music production as a creative outlet, and active participation in technology community events and workshops.",
                category: 'hobbies',
                embedding: null
            },
            {
                id: 'community_involvement',
                content: 'community involvement tech meetups conferences workshops mentoring knowledge sharing open source contributions developer community',
                response: "Community involvement includes participation in tech meetups and conferences, conducting workshops, mentoring junior developers, contributing to open source projects, and actively sharing knowledge within the developer community.",
                category: 'hobbies',
                embedding: null
            },

            // Industry Insights
            {
                id: 'technology_trends',
                content: 'technology trends artificial intelligence machine learning cloud computing edge computing blockchain IoT cybersecurity future tech',
                response: "Stays current with technology trends including advancements in artificial intelligence, machine learning innovations, cloud computing evolution, edge computing, blockchain applications, IoT developments, and cybersecurity best practices.",
                category: 'insights',
                embedding: null
            },
            {
                id: 'industry_perspective',
                content: 'industry perspective software development best practices emerging technologies digital transformation business value innovation',
                response: "Industry perspective focuses on software development best practices, emerging technology adoption, digital transformation strategies, creating business value through technology innovation, and sustainable development approaches.",
                category: 'insights',
                embedding: null
            }
        ];

        // Conversation context and patterns for smarter interactions
        this.conversationContext = {
            lastTopic: null,
            userInterests: [],
            conversationHistory: [],
            sessionStartTime: Date.now(),
            messageCount: 0
        };

        this.conversationPatterns = {
            greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy'],
            questions: ['what', 'how', 'why', 'when', 'where', 'who', 'can you', 'do you', 'are you', 'tell me', 'explain', 'describe'],
            compliments: ['great', 'awesome', 'amazing', 'excellent', 'fantastic', 'wonderful', 'impressive', 'cool', 'nice'],
            requests: ['help', 'assist', 'support', 'guide', 'explain', 'show', 'teach', 'demonstrate', 'recommend', 'suggest'],
            farewells: ['bye', 'goodbye', 'see you', 'farewell', 'take care', 'until next time', 'later', 'catch you later'],
            technical: ['code', 'programming', 'development', 'algorithm', 'framework', 'library', 'api', 'database', 'server'],
            personal: ['about', 'yourself', 'background', 'experience', 'story', 'journey', 'interests', 'hobbies']
        };

        this.smartResponses = {
            followUp: [
                "Would you like to know more about any specific aspect?",
                "Is there a particular technology or project you'd like to explore further?",
                "Feel free to ask about any technical details or implementation approaches.",
                "I can provide more specific information if you have particular questions.",
                "What other aspects of my work interest you?",
                "Would you like to dive deeper into any particular area?"
            ],
            encouragement: [
                "That's a great question! Let me provide you with detailed information.",
                "Excellent inquiry! I'm happy to share insights about that.",
                "I appreciate your interest! Here's what I can tell you about that.",
                "Perfect question! I'd love to elaborate on that topic.",
                "Great choice of topic! Let me share my experience with that."
            ],
            clarification: [
                "Could you be more specific about what aspect interests you most?",
                "I'd be happy to elaborate - which particular area would you like me to focus on?",
                "There are several aspects to consider - what would be most helpful for you?",
                "That's a broad topic - what specific part would you like me to address?",
                "I can cover multiple angles - what's your main interest here?"
            ],
            contextual: [
                "Based on our conversation, you might also be interested in",
                "Since you asked about that, you might want to know about",
                "Following up on your previous question",
                "Building on what we discussed",
                "Related to your earlier inquiry"
            ]
        };

        // Intent recognition patterns for advanced NLP
        this.intentPatterns = {
            question: {
                patterns: ['what', 'how', 'when', 'where', 'why', 'which', 'who', '?'],
                confidence: 0.8
            },
            request: {
                patterns: ['can you', 'could you', 'please', 'show me', 'tell me', 'explain'],
                confidence: 0.7
            },
            greeting: {
                patterns: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
                confidence: 0.9
            },
            compliment: {
                patterns: ['great', 'awesome', 'amazing', 'excellent', 'wonderful', 'impressive'],
                confidence: 0.6
            },
            interest: {
                patterns: ['interested in', 'want to know', 'curious about', 'learn more'],
                confidence: 0.8
            },
            comparison: {
                patterns: ['vs', 'versus', 'compare', 'difference', 'better than', 'which is'],
                confidence: 0.7
            }
        };

        // Entity extraction patterns for better understanding
        this.entityPatterns = {
            technologies: {
                patterns: ['python', 'javascript', 'react', 'flutter', 'tensorflow', 'pytorch', 'aws', 'docker', 'kubernetes', 'nodejs', 'mongodb', 'mysql'],
                type: 'technology'
            },
            projectTypes: {
                patterns: ['web app', 'mobile app', 'ai project', 'machine learning', 'website', 'application', 'chatbot', 'ecommerce'],
                type: 'project_type'
            },
            contactMethods: {
                patterns: ['email', 'linkedin', 'github', 'phone', 'contact', 'reach', 'hire', 'collaborate'],
                type: 'contact_method'
            },
            timeframes: {
                patterns: ['when', 'how long', 'timeline', 'duration', 'availability', 'schedule'],
                type: 'timeframe'
            },
            skills: {
                patterns: ['skills', 'expertise', 'experience', 'knowledge', 'proficiency', 'abilities'],
                type: 'skill_inquiry'
            }
        };

        this.initializeEmbeddings();
    }

    // Simple embedding simulation using word frequency and semantic weights
    generateEmbedding(text) {
        const words = text.toLowerCase().split(/\s+/);
        const embedding = new Array(50).fill(0); // 50-dimensional embedding

        // Semantic weight mapping for technical terms
        const semanticWeights = {
            'ai': 10, 'machine': 9, 'learning': 9, 'python': 8, 'javascript': 8,
            'tensorflow': 8, 'pytorch': 8, 'react': 7, 'flutter': 7, 'aws': 7,
            'developer': 6, 'engineer': 6, 'projects': 6, 'skills': 6, 'experience': 6,
            'contact': 5, 'email': 5, 'linkedin': 5, 'github': 5, 'education': 5,
            'photography': 4, 'music': 4, 'fitness': 4, 'hobbies': 4
        };

        words.forEach((word, index) => {
            const weight = semanticWeights[word] || 1;
            const position = Math.abs(word.charCodeAt(0) - 97) % 50;
            embedding[position] += weight * (1 + Math.log(words.length - index));
        });

        // Normalize embedding
        const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
        return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
    }

    initializeEmbeddings() {
        this.knowledgeBase.forEach(item => {
            item.embedding = this.generateEmbedding(item.content);
        });
    }

    // Calculate cosine similarity between two embeddings
    cosineSimilarity(embedding1, embedding2) {
        if (!embedding1 || !embedding2) return 0;

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < embedding1.length; i++) {
            dotProduct += embedding1[i] * embedding2[i];
            norm1 += embedding1[i] * embedding1[i];
            norm2 += embedding2[i] * embedding2[i];
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    // Vector search to find most relevant knowledge
    vectorSearch(query, threshold = 0.1) {
        const queryEmbedding = this.generateEmbedding(query);
        const results = [];

        this.knowledgeBase.forEach(item => {
            const similarity = this.cosineSimilarity(queryEmbedding, item.embedding);
            if (similarity > threshold) {
                results.push({
                    ...item,
                    similarity: similarity
                });
            }
        });

        // Sort by similarity score (descending)
        return results.sort((a, b) => b.similarity - a.similarity);
    }

    // Enhanced intelligent response with conversation awareness
    generateIntelligentResponse(query) {
        const lowerQuery = query.toLowerCase();

        // Advanced NLP analysis
        const analysis = this.analyzeQuery(query);

        // Update conversation context
        this.conversationContext.messageCount++;
        this.conversationContext.conversationHistory.push({
            query: query,
            timestamp: Date.now(),
            analysis: analysis
        });

        // Keep only last 10 messages for context
        if (this.conversationContext.conversationHistory.length > 10) {
            this.conversationContext.conversationHistory.shift();
        }

        // Use intent-based response generation
        const intent = analysis.intent;
        const entities = analysis.entities;
        const patternType = analysis.conversationPattern;

        // Handle intent-based responses with enhanced intelligence
        if (intent.type === 'greeting' && this.conversationContext.messageCount === 1) {
            const encouragement = this.getRandomResponse('encouragement');
            return {
                response: `Hello! I'm Kgaugelo's AI assistant. ${encouragement} I can tell you about his skills, projects, experience, or anything else you'd like to know!`,
                confidence: 0.9,
                source: 'greeting',
                followUp: ["What would you like to know about Kgaugelo?", "Tell me about his projects", "What are his main skills?"]
            };
        }

        if (intent.type === 'compliment') {
            return {
                response: "Thank you for the kind words! Mr. Mmakola takes great pride in his work and is always striving to deliver exceptional results. Is there anything specific about his work you'd like to explore?",
                confidence: 0.8,
                source: 'social',
                followUp: ["Show me his best projects", "What technologies does he use?", "How can I contact him?"]
            };
        }

        // Handle comparison queries with intelligent responses
        if (intent.type === 'comparison' && entities.length > 0) {
            const techEntities = entities.filter(e => e.type === 'technology');
            if (techEntities.length > 0) {
                return {
                    response: `Great question about technology comparisons! Mr. Mmakola has experience with ${techEntities.map(e => e.text).join(', ')} and can provide insights on their strengths, use cases, and when to choose one over another based on project requirements.`,
                    confidence: 0.8,
                    source: 'comparison',
                    followUp: ["Tell me about his experience with these technologies", "What projects has he used them in?", "Which does he recommend for my project?"]
                };
            }
        }

        // Handle specific entity-based responses
        if (entities.length > 0) {
            const contactEntities = entities.filter(e => e.type === 'contact_method');
            if (contactEntities.length > 0) {
                return {
                    response: "For professional inquiries, Mr. Mmakola can be reached via email at kg.mmakola@outlook.com. He maintains active profiles on LinkedIn and GitHub for networking and collaboration. He welcomes discussions about career opportunities, partnerships, and consulting engagements.",
                    confidence: 0.9,
                    source: 'contact',
                    followUp: ["What services does he offer?", "What's his availability?", "How much does he charge?"]
                };
            }

            const techEntities = entities.filter(e => e.type === 'technology');
            if (techEntities.length > 0 && intent.type === 'question') {
                const tech = techEntities[0].text;
                return {
                    response: `Excellent question about ${tech}! Mr. Mmakola has extensive experience with ${tech} and has used it in multiple professional projects. He can provide detailed insights about implementation, best practices, and how it integrates with other technologies in his stack.`,
                    confidence: 0.8,
                    source: 'technology',
                    followUp: [`Show me projects using ${tech}`, `What other technologies work well with ${tech}?`, `How experienced is he with ${tech}?`]
                };
            }
        }

        // Perform vector search
        const searchResults = this.vectorSearch(query);

        if (searchResults.length > 0) {
            const bestMatch = searchResults[0];

            // Track user interests
            this.updateUserInterests(bestMatch.category);
            this.conversationContext.lastTopic = bestMatch.category;

            // High confidence match with smart enhancements
            if (bestMatch.similarity > 0.3) {
                let response = bestMatch.response;

                // Add contextual information based on conversation history
                if (this.conversationContext.messageCount > 1) {
                    const contextualIntro = this.getRandomResponse('contextual');
                    if (this.hasRelatedPreviousTopics(bestMatch.category)) {
                        response = `${contextualIntro} ${bestMatch.category}. ${response}`;
                    }
                }

                return {
                    response: response,
                    confidence: bestMatch.similarity,
                    source: bestMatch.category,
                    followUp: this.generateSmartFollowUp(bestMatch.category)
                };
            }

            // Moderate confidence - combine and enhance
            if (bestMatch.similarity > 0.15) {
                const topResults = searchResults.slice(0, 2);
                const combinedResponse = topResults.map(result => result.response).join(' ');

                return {
                    response: combinedResponse,
                    confidence: bestMatch.similarity,
                    source: 'combined',
                    followUp: this.getRandomResponse('clarification')
                };
            }
        }

        // Enhanced contextual fallback
        return this.generateContextualResponse(query);
    }

    // Helper methods for smart conversation handling
    detectConversationPattern(query) {
        for (const [pattern, keywords] of Object.entries(this.conversationPatterns)) {
            if (keywords.some(keyword => query.includes(keyword))) {
                return pattern;
            }
        }
        return 'general';
    }

    getRandomResponse(type) {
        const responses = this.smartResponses[type];
        return responses ? responses[Math.floor(Math.random() * responses.length)] : '';
    }

    updateUserInterests(category) {
        if (!this.conversationContext.userInterests.includes(category)) {
            this.conversationContext.userInterests.push(category);
        }
    }

    hasRelatedPreviousTopics(currentCategory) {
        const relatedCategories = {
            'skills': ['projects', 'education'],
            'projects': ['skills', 'services'],
            'about': ['education', 'hobbies'],
            'services': ['skills', 'projects']
        };

        return this.conversationContext.userInterests.some(interest =>
            relatedCategories[currentCategory]?.includes(interest)
        );
    }

    generateSmartFollowUp(category) {
        const categoryFollowUps = {
            'skills': "Would you like to see how these skills are applied in specific projects?",
            'projects': "Would you like to know more about the technologies used in these projects?",
            'about': "Is there a particular aspect of his background you'd like to explore further?",
            'contact': "Would you like to know about collaboration opportunities or consulting services?",
            'education': "Are you interested in his approach to continuous learning and skill development?",
            'services': "Would you like to discuss how these services could benefit your specific needs?"
        };

        return categoryFollowUps[category] || this.getRandomResponse('followUp');
    }

    // Advanced NLP: Intent Recognition
    recognizeIntent(query) {
        const lowerQuery = query.toLowerCase();
        let bestIntent = { type: 'general', confidence: 0 };

        for (const [intentType, intentData] of Object.entries(this.intentPatterns)) {
            let matchCount = 0;
            let totalPatterns = intentData.patterns.length;

            for (const pattern of intentData.patterns) {
                if (lowerQuery.includes(pattern.toLowerCase())) {
                    matchCount++;
                }
            }

            const confidence = (matchCount / totalPatterns) * intentData.confidence;
            if (confidence > bestIntent.confidence) {
                bestIntent = { type: intentType, confidence };
            }
        }

        return bestIntent;
    }

    // Advanced NLP: Entity Extraction
    extractEntities(query) {
        const lowerQuery = query.toLowerCase();
        const entities = [];

        for (const [entityGroup, entityData] of Object.entries(this.entityPatterns)) {
            for (const pattern of entityData.patterns) {
                if (lowerQuery.includes(pattern.toLowerCase())) {
                    entities.push({
                        text: pattern,
                        type: entityData.type,
                        group: entityGroup,
                        confidence: 0.8
                    });
                }
            }
        }

        return entities;
    }

    // Enhanced query analysis using intent and entities
    analyzeQuery(query) {
        const intent = this.recognizeIntent(query);
        const entities = this.extractEntities(query);
        const conversationPattern = this.detectConversationPattern(query.toLowerCase());

        return {
            intent,
            entities,
            conversationPattern,
            complexity: this.calculateQueryComplexity(query),
            context: this.getQueryContext(entities)
        };
    }

    calculateQueryComplexity(query) {
        const words = query.split(' ').length;
        const hasQuestionWords = ['what', 'how', 'why', 'when', 'where'].some(q => query.toLowerCase().includes(q));
        const hasMultipleTopics = query.split(' and ').length > 1 || query.split(' or ').length > 1;

        if (words > 15 || hasMultipleTopics) return 'high';
        if (words > 8 || hasQuestionWords) return 'medium';
        return 'low';
    }

    getQueryContext(entities) {
        const context = {
            hasTechnicalTerms: entities.some(e => e.type === 'technology'),
            hasProjectInquiry: entities.some(e => e.type === 'project_type'),
            hasContactIntent: entities.some(e => e.type === 'contact_method'),
            hasTimeframe: entities.some(e => e.type === 'timeframe')
        };

        return context;
    }

    generateContextualResponse(query) {
        const lowerQuery = query.toLowerCase();

        // Enhanced pattern matching with smart responses
        if (lowerQuery.includes('how') && (lowerQuery.includes('contact') || lowerQuery.includes('reach'))) {
            return {
                response: "You can reach Mr. Mmakola via email at kg.mmakola@outlook.com or connect with him on LinkedIn and GitHub for professional networking. He's always open to discussing new opportunities and collaborations!",
                confidence: 0.8,
                source: 'contextual',
                followUp: "Would you like to know about his availability for consulting or collaboration?"
            };
        }

        if (lowerQuery.includes('experience') || lowerQuery.includes('years')) {
            return {
                response: "Mr. Mmakola has extensive experience in the technology industry, with a strong background in AI/ML engineering and full-stack development. His experience spans multiple domains including web applications, mobile development, and enterprise AI solutions.",
                confidence: 0.7,
                source: 'contextual',
                followUp: "Would you like to know about specific projects or technologies he's worked with?"
            };
        }

        if (lowerQuery.includes('what') && (lowerQuery.includes('do') || lowerQuery.includes('work'))) {
            return {
                response: "Mr. Mmakola works as an AI/ML Engineer and Full-Stack Developer, specializing in machine learning solutions, data science, and enterprise web development. He creates innovative solutions that bridge the gap between complex AI technologies and practical business applications.",
                confidence: 0.8,
                source: 'contextual',
                followUp: "Would you like to know about specific technologies he works with or see examples of his projects?"
            };
        }

        if (lowerQuery.includes('why') || lowerQuery.includes('motivation')) {
            return {
                response: "Mr. Mmakola is passionate about leveraging technology to solve real-world problems. His motivation comes from the potential of AI and machine learning to transform industries and improve people's lives through innovative solutions.",
                confidence: 0.7,
                source: 'contextual',
                followUp: "Would you like to learn more about his approach to problem-solving or his vision for technology?"
            };
        }

        if (lowerQuery.includes('learn') || lowerQuery.includes('study') || lowerQuery.includes('education')) {
            return {
                response: "Mr. Mmakola believes in continuous learning and stays current with the latest technology trends. He combines formal education with hands-on experience, online courses, and active participation in the tech community.",
                confidence: 0.7,
                source: 'contextual',
                followUp: "Are you interested in his educational background or his approach to staying current with technology?"
            };
        }

        if (lowerQuery.includes('future') || lowerQuery.includes('goals') || lowerQuery.includes('plans')) {
            return {
                response: "Mr. Mmakola is focused on advancing AI/ML technologies and their practical applications. He aims to contribute to innovative projects that make a meaningful impact while continuing to grow his expertise in emerging technologies.",
                confidence: 0.7,
                source: 'contextual',
                followUp: "Would you like to know about specific areas of technology he's exploring or potential collaboration opportunities?"
            };
        }

        if (lowerQuery.includes('help') || lowerQuery.includes('assist') || lowerQuery.includes('support')) {
            return {
                response: "Mr. Mmakola can help with AI/ML implementation, full-stack development, technical consulting, and digital transformation projects. He offers expertise in everything from initial concept to deployment and optimization.",
                confidence: 0.8,
                source: 'contextual',
                followUp: "What specific type of project or challenge are you working on that might benefit from his expertise?"
            };
        }

        if (lowerQuery.includes('cost') || lowerQuery.includes('price') || lowerQuery.includes('rate')) {
            return {
                response: "For pricing and project estimates, it's best to contact Mr. Mmakola directly at kg.mmakola@outlook.com. He provides customized quotes based on project scope, timeline, and specific requirements.",
                confidence: 0.8,
                source: 'contextual',
                followUp: "Would you like guidance on how to prepare a project brief for the most accurate estimate?"
            };
        }

        if (lowerQuery.includes('available') || lowerQuery.includes('availability') || lowerQuery.includes('free')) {
            return {
                response: "For current availability and scheduling, please reach out to Mr. Mmakola directly at kg.mmakola@outlook.com. He'll be happy to discuss your project timeline and how he can accommodate your needs.",
                confidence: 0.8,
                source: 'contextual',
                followUp: "Would you like tips on how to effectively communicate your project requirements?"
            };
        }

        // Smart suggestions based on conversation context
        if (this.conversationContext.messageCount > 3) {
            const suggestions = this.generateSmartSuggestions();
            return {
                response: "I'd be happy to help you learn more about Mr. Mmakola's work. " + suggestions,
                confidence: 0.6,
                source: 'smart_suggestions',
                followUp: "What specific aspect would you like to explore?"
            };
        }

        // Default intelligent response
        const encouragement = this.getRandomResponse('encouragement');
        return {
            response: `${encouragement} I can provide information about Mr. Mmakola's skills, projects, experience, contact details, or any other aspect of his professional work. What would you like to know?`,
            confidence: 0.5,
            source: 'default',
            followUp: this.getRandomResponse('followUp')
        };
    }

    generateSmartSuggestions() {
        const interests = this.conversationContext.userInterests;
        const suggestions = [];

        if (!interests.includes('skills')) {
            suggestions.push("his technical skills and expertise");
        }
        if (!interests.includes('projects')) {
            suggestions.push("his portfolio of projects");
        }
        if (!interests.includes('services')) {
            suggestions.push("the services he offers");
        }
        if (!interests.includes('contact')) {
            suggestions.push("how to get in touch with him");
        }

        if (suggestions.length === 0) {
            return "Based on our conversation, you might want to explore his latest projects or discuss potential collaboration opportunities.";
        }

        const randomSuggestions = suggestions.slice(0, 2);
        return `You might be interested in learning about ${randomSuggestions.join(' or ')}.`;
    }
}

class Chatbot {
    constructor() {
        this.isOpen = false;
        this.aiIntelligence = new AIIntelligence();
        this.responses = {
            greetings: [
                "Good day! I am Kgaugelo's professional virtual assistant. How may I assist you with your inquiry today?",
                "Welcome to Kgaugelo Mmakola's professional portfolio. I am here to provide you with comprehensive information about his expertise and services.",
                "Greetings! I am pleased to assist you in learning more about Kgaugelo's professional background and capabilities. What specific information are you seeking?"
            ],
            about: [
                "Mr. Kgaugelo Mmakola is a distinguished AI/ML Engineer and Full-Stack Developer based in South Africa, specializing in advanced machine learning solutions, data science methodologies, and enterprise-grade web development.",
                "He is currently advancing his academic pursuits while simultaneously leading innovative AI projects and making significant contributions to open-source technology communities.",
                "Mr. Mmakola excels in synthesizing deep technical expertise with strategic problem-solving approaches to deliver cutting-edge technological solutions for complex business challenges."
            ],
            skills: [
                "Mr. Mmakola's core competencies encompass Python, JavaScript, Flutter/Dart, TensorFlow, PyTorch, React, and enterprise cloud platforms including AWS and Google Cloud Platform.",
                "His professional expertise spans machine learning, deep learning, computer vision, natural language processing, and comprehensive full-stack development with enterprise-level architecture design.",
                "His technical proficiency covers end-to-end solution development, from frontend user experience design to backend infrastructure, with specialized focus on AI/ML integration and scalable system architecture."
            ],
            projects: [
                "Mr. Mmakola has successfully delivered numerous high-impact projects including enterprise AI-powered applications, scalable web platforms, and cross-platform mobile solutions.",
                "Notable achievements include sophisticated machine learning models for predictive analytics, enterprise-grade full-stack applications, and substantial contributions to industry-leading open-source initiatives.",
                "I encourage you to review his comprehensive project portfolio to examine detailed case studies and technical implementations of his most recent professional work."
            ],
            contact: [
                "For professional inquiries, Mr. Mmakola can be reached via email at kg.mmakola@outlook.com. He maintains active professional profiles on LinkedIn and GitHub for networking and collaboration purposes.",
                "He welcomes discussions regarding career opportunities, strategic partnerships, consulting engagements, and technology-focused professional dialogue.",
                "Please visit the Contact section for comprehensive communication options, including the ability to schedule formal consultation appointments."
            ],
            hobbies: [
                "Beyond his professional commitments, Mr. Mmakola pursues photography, digital artistry, physical fitness, continuous learning through technical literature, and exploration of emerging technologies.",
                "He actively participates in music production, outdoor activities, and maintains engagement with the professional technology community through industry conferences and networking events.",
                "The Hobbies section provides detailed insights into his personal interests and how they complement his professional development."
            ],
            education: [
                "Mr. Mmakola is currently pursuing advanced academic studies while simultaneously gaining substantial practical experience within the technology industry.",
                "He maintains a commitment to lifelong learning and stays current with the latest advancements in artificial intelligence, machine learning, and software engineering methodologies.",
                "His educational foundation is strategically aligned with his hands-on experience in developing and deploying real-world enterprise applications."
            ],
            default: [
                "That is an excellent inquiry. You may find comprehensive information addressing your question within the relevant sections of this professional portfolio.",
                "I recommend exploring the detailed sections of Mr. Mmakola's portfolio for specific technical and professional information.",
                "Please feel free to inquire about Mr. Mmakola's technical expertise, project experience, professional background, or preferred methods of professional communication."
            ]
        };

        this.keywords = {
            greetings: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
            about: ['about', 'background', 'who', 'biography', 'bio', 'story', 'experience'],
            skills: ['skills', 'technologies', 'programming', 'languages', 'tech stack', 'abilities', 'expertise', 'tools'],
            projects: ['projects', 'work', 'portfolio', 'applications', 'apps', 'websites', 'development'],
            contact: ['contact', 'email', 'reach', 'connect', 'linkedin', 'github', 'social', 'hire', 'collaboration'],
            hobbies: ['hobbies', 'interests', 'free time', 'photography', 'music', 'fitness', 'personal'],
            education: ['education', 'study', 'school', 'university', 'degree', 'academic', 'learning']
        };

        this.initializeChatbot();
    }

    initializeChatbot() {
        const chatButton = document.getElementById('chat-button');
        const chatWindow = document.getElementById('chat-window');
        const closeChat = document.getElementById('close-chat');
        const sendButton = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');

        if (chatButton) {
            chatButton.addEventListener('click', () => this.toggleChat());
        }

        if (closeChat) {
            closeChat.addEventListener('click', () => this.closeChat());
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            chatWindow.classList.add('active');
            this.isOpen = true;

            // Focus on input
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                setTimeout(() => chatInput.focus(), 300);
            }
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            chatWindow.classList.remove('active');
            this.isOpen = false;
        }
    }

    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();

        if (message) {
            this.addMessage(message, 'user');
            chatInput.value = '';

            // Show typing indicator with AI processing message
            this.showTypingIndicator('Processing with AI...');

            // Generate response after a short delay
            setTimeout(() => {
                this.hideTypingIndicator();

                // Get AI-powered response with metadata
                const lowerMessage = message.toLowerCase();
                let response, metadata = null;

                // Handle greetings first
                const greetingKeywords = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
                if (greetingKeywords.some(keyword => lowerMessage.includes(keyword))) {
                    const greetings = this.responses.greetings;
                    response = greetings[Math.floor(Math.random() * greetings.length)];
                } else if (lowerMessage.includes('thank')) {
                    response = "You're most welcome! I'm here to assist you with any questions about Mr. Mmakola's professional expertise and background. Feel free to ask anything else!";
                } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
                    response = "Thank you for visiting Mr. Mmakola's portfolio! Don't hesitate to reach out if you need anything else. Have a wonderful day!";
                } else {
                    // Use AI Intelligence for sophisticated response generation
                    const aiResponse = this.aiIntelligence.generateIntelligentResponse(message);
                    metadata = aiResponse;

                    // Add confidence indicator for high-quality responses
                    if (aiResponse.confidence > 0.7) {
                        response = `${aiResponse.response} 🎯`;
                    } else if (aiResponse.confidence > 0.5) {
                        response = aiResponse.response;
                    } else {
                        // Fallback to keyword-based system for very low confidence
                        let foundKeywordMatch = false;
                        for (const [category, keywords] of Object.entries(this.keywords)) {
                            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                                const responses = this.responses[category];
                                response = responses[Math.floor(Math.random() * responses.length)];
                                foundKeywordMatch = true;
                                break;
                            }
                        }
                        if (!foundKeywordMatch) {
                            response = aiResponse.response;
                        }
                    }
                }

                this.addMessage(response, 'bot', metadata);
            }, 1200 + Math.random() * 800); // Random delay between 1.2-2 seconds for AI processing
        }
    }

    addMessage(text, sender, metadata = null) {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;

            // Add AI intelligence indicators for bot messages
            if (sender === 'bot' && metadata) {
                let intelligenceIndicator = '';
                if (metadata.confidence > 0.7) {
                    intelligenceIndicator = '<span class="ai-indicator high-confidence" title="High confidence AI response">🧠</span>';
                } else if (metadata.confidence > 0.5) {
                    intelligenceIndicator = '<span class="ai-indicator medium-confidence" title="AI-powered response">🤖</span>';
                } else if (metadata.source === 'contextual') {
                    intelligenceIndicator = '<span class="ai-indicator contextual" title="Contextual AI response">💡</span>';
                }

                let messageContent = `<p>${text} ${intelligenceIndicator}</p>`;

                // Add follow-up suggestions if available
                if (metadata.followUp) {
                    messageContent += `<div class="follow-up-suggestions">
                        <p class="follow-up-label">💡 You might also ask:</p>
                        <div class="suggestion-buttons">`;

                    // Handle both string and array types for followUp
                    const suggestions = Array.isArray(metadata.followUp) ? metadata.followUp : [metadata.followUp];
                    suggestions.forEach(suggestion => {
                        messageContent += `<button class="suggestion-btn" onclick="this.closest('.chatbot-container').querySelector('.chat-input').value='${suggestion}'; this.closest('.chatbot-container').querySelector('.send-btn').click();">${suggestion}</button>`;
                    });

                    messageContent += `</div></div>`;
                }

                messageDiv.innerHTML = messageContent;
            } else {
                messageDiv.innerHTML = `<p>${text}</p>`;
            }

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    showTypingIndicator(customMessage = null) {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot-message typing-indicator';
            typingDiv.id = 'typing-indicator';

            if (customMessage) {
                typingDiv.innerHTML = `<p>${customMessage}<span class="dots">...</span> <span class="ai-processing">🤖</span></p>`;
            } else {
                typingDiv.innerHTML = '<p>Typing<span class="dots">...</span></p>';
            }

            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Handle greetings first
        const greetingKeywords = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
        if (greetingKeywords.some(keyword => lowerMessage.includes(keyword))) {
            const greetings = this.responses.greetings;
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // Handle thanks and goodbye
        if (lowerMessage.includes('thank')) {
            return "You're most welcome! I'm here to assist you with any questions about Mr. Mmakola's professional expertise and background. Feel free to ask anything else!";
        }

        if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            return "Thank you for visiting Mr. Mmakola's portfolio! Don't hesitate to reach out if you need anything else. Have a wonderful day!";
        }

        // Use AI Intelligence for sophisticated response generation
        const aiResponse = this.aiIntelligence.generateIntelligentResponse(message);

        // Add confidence indicator for high-quality responses
        if (aiResponse.confidence > 0.7) {
            return `${aiResponse.response} 🎯`;
        } else if (aiResponse.confidence > 0.5) {
            return aiResponse.response;
        } else {
            // Fallback to keyword-based system for very low confidence
            for (const [category, keywords] of Object.entries(this.keywords)) {
                if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                    const responses = this.responses[category];
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
            return aiResponse.response;
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if chatbot elements exist before initializing
    if (document.getElementById('chatbot-container')) {
        new Chatbot();
    }
});

// Add typing animation styles for chatbot
const chatbotStyles = document.createElement('style');
chatbotStyles.textContent = `
    .typing-indicator .dots {
        animation: typing 1.4s infinite;
    }
    
    @keyframes typing {
        0%, 60%, 100% {
            opacity: 0;
        }
        30% {
            opacity: 1;
        }
    }
    
    .typing-indicator .dots::after {
        content: '';
        animation: typing 1.4s infinite 0.2s;
    }
    
    .typing-indicator .dots::before {
        content: '';
        animation: typing 1.4s infinite 0.4s;
    }
`;
document.head.appendChild(chatbotStyles);