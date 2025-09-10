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