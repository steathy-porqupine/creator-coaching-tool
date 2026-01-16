// Tab switching functionality
function switchTab(tabName) {
    // Track tab switch
    trackTabSwitch(tabName);
    
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.nav-tab');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Highlight active button
    const clickedButton = event.target;
    if (clickedButton && clickedButton.classList.contains('nav-tab')) {
        clickedButton.classList.add('active');
    }
}

// Copy text to clipboard
function copyText(button, text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            button.textContent = '✓ Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text:', err);
            // Fallback for older browsers
            fallbackCopyText(text, button);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyText(text, button);
    }
}

// Fallback copy method for older browsers
function fallbackCopyText(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        button.textContent = '✓ Copied!';
        button.classList.add('copied');
        setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Fallback copy failed:', err);
        button.textContent = 'Copy Failed';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    } finally {
        document.body.removeChild(textArea);
    }
}

// Track user interactions (subtle analytics)
function trackInteraction(eventType, data) {
    // Store interaction data (can be sent to analytics later)
    if (typeof window.trackingData === 'undefined') {
        window.trackingData = [];
    }
    window.trackingData.push({
        type: eventType,
        data: data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
    });
    
    // Send to Netlify Analytics if available (silent)
    if (window.netlify && window.netlify.track) {
        window.netlify.track(eventType, data);
    }
}

// Check practice response
function checkPractice(scenarioNum) {
    const textarea = document.getElementById('practice-' + scenarioNum);
    const feedback = document.getElementById('feedback-' + scenarioNum);
    const form = textarea ? textarea.closest('form') : null;
    
    if (!textarea || !feedback) {
        console.error('Practice elements not found');
        return;
    }
    
    const text = textarea.value.trim().toLowerCase();

    let isGood = false;
    let message = '';

    if (!text) {
        feedback.textContent = '👀 You gotta write something!';
        feedback.classList.add('show', 'bad');
        feedback.classList.remove('good');
        return;
    }

    // Simple checks for good vs bad patterns
    const badWords = ['link in bio', 'help a girl out', 'please buy', 'limited time', 'hurry', 'click now', '!!'];
    const goodWords = ['curious', 'thanks', 'appreciate', 'interested', 'feel', 'vibe', 'no pressure', 'if you want'];

    const hasBad = badWords.some(word => text.includes(word));
    const hasGood = goodWords.some(word => text.includes(word));

    if (hasBad) {
        isGood = false;
        message = '⚠️ Careful! This sounds a bit pushy. Try removing urgency words like "hurry," "limited time," or "click now."';
    } else if (hasGood && text.length > 20) {
        isGood = true;
        message = '✅ Nice! This feels warm and curious. People respond to this energy.';
    } else if (text.length > 20) {
        isGood = true;
        message = '✅ Solid! This is respectful and opens dialogue. Good approach.';
    } else {
        isGood = false;
        message = '💭 Keep it simple but conversational. Add a question or show genuine interest.';
    }

    feedback.textContent = message;
    feedback.classList.add('show');
    feedback.classList.toggle('good', isGood);
    feedback.classList.toggle('bad', !isGood);

    // Submit form to Netlify (silent background submission)
    if (form) {
        // Ensure textarea value is captured (use original text, not lowercase)
        const originalText = textarea.value.trim();
        
        // Add timestamp and feedback result to form
        let timestampInput = form.querySelector('input[name="timestamp"]');
        if (!timestampInput) {
            timestampInput = document.createElement('input');
            timestampInput.type = 'hidden';
            timestampInput.name = 'timestamp';
            form.appendChild(timestampInput);
        }
        timestampInput.value = new Date().toISOString();

        let feedbackInput = form.querySelector('input[name="feedback-result"]');
        if (!feedbackInput) {
            feedbackInput = document.createElement('input');
            feedbackInput.type = 'hidden';
            feedbackInput.name = 'feedback-result';
            form.appendChild(feedbackInput);
        }
        feedbackInput.value = isGood ? 'good' : 'needs-improvement';

        let textLengthInput = form.querySelector('input[name="text-length"]');
        if (!textLengthInput) {
            textLengthInput = document.createElement('input');
            textLengthInput.type = 'hidden';
            textLengthInput.name = 'text-length';
            form.appendChild(textLengthInput);
        }
        textLengthInput.value = originalText.length;

        // Submit form silently (no page reload) - Netlify Forms format
        const formData = new FormData(form);
        // Ensure the practice-response field is included
        formData.set('practice-response', originalText);
        
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        }).then(() => {
            // Successfully submitted - data will appear in Netlify dashboard
        }).catch(err => {
            // Silently handle errors - don't interrupt user experience
            console.log('Form submission logged');
        });

        // Track interaction
        trackInteraction('practice_submission', {
            scenario: scenarioNum,
            textLength: originalText.length,
            feedback: isGood ? 'good' : 'needs-improvement',
            hasBadWords: hasBad,
            hasGoodWords: hasGood
        });
    }
}

// Track text input in practice areas (subtle - tracks typing patterns)
function setupTextTracking() {
    const practiceTextareas = document.querySelectorAll('textarea[id^="practice-"]');
    practiceTextareas.forEach(textarea => {
        let startTime = null;
        let keystrokeCount = 0;
        let lastKeystrokeTime = null;

        textarea.addEventListener('focus', () => {
            startTime = Date.now();
            trackInteraction('textarea_focus', {
                scenario: textarea.id.replace('practice-', ''),
                timestamp: new Date().toISOString()
            });
        });

        textarea.addEventListener('input', () => {
            keystrokeCount++;
            lastKeystrokeTime = Date.now();
            
            // Track every 10 keystrokes (subtle)
            if (keystrokeCount % 10 === 0) {
                trackInteraction('textarea_typing', {
                    scenario: textarea.id.replace('practice-', ''),
                    keystrokeCount: keystrokeCount,
                    timeSpent: startTime ? Date.now() - startTime : 0,
                    currentLength: textarea.value.length
                });
            }
        });

        textarea.addEventListener('blur', () => {
            if (startTime) {
                const timeSpent = Date.now() - startTime;
                trackInteraction('textarea_blur', {
                    scenario: textarea.id.replace('practice-', ''),
                    timeSpent: timeSpent,
                    finalLength: textarea.value.length,
                    keystrokeCount: keystrokeCount
                });
            }
        });
    });
}

// Track tab switches
function trackTabSwitch(tabName) {
    trackInteraction('tab_switch', {
        tab: tabName,
        timestamp: new Date().toISOString()
    });
}

// Track copy button clicks
function setupCopyTracking() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn')) {
            const scriptCard = e.target.closest('.script-card');
            const scriptLabel = scriptCard ? scriptCard.querySelector('.script-label')?.textContent : 'Unknown';
            trackInteraction('script_copied', {
                script: scriptLabel,
                timestamp: new Date().toISOString()
            });
        }
    });
}

// Track page views and time on page
function setupPageTracking() {
    trackInteraction('page_view', {
        page: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
    });

    // Track time on page (every 30 seconds)
    setInterval(() => {
        trackInteraction('time_on_page', {
            seconds: Math.floor((Date.now() - window.pageLoadTime) / 1000)
        });
    }, 30000);

    window.pageLoadTime = Date.now();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Track page load
    setupPageTracking();
    setupTextTracking();
    setupCopyTracking();
    
    // Ensure first tab is active
    const firstTab = document.querySelector('.tab-content.active');
    const firstButton = document.querySelector('.nav-tab.active');
    
    if (!firstTab) {
        const scenariosTab = document.getElementById('scenarios');
        if (scenariosTab) {
            scenariosTab.classList.add('active');
        }
    }
    
    if (!firstButton) {
        const firstNavButton = document.querySelector('.nav-tab');
        if (firstNavButton) {
            firstNavButton.classList.add('active');
        }
    }
    
    // Add keyboard navigation support for tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach((tab, index) => {
        tab.setAttribute('tabindex', '0');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
        
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowRight' 
                    ? (index + 1) % navTabs.length 
                    : (index - 1 + navTabs.length) % navTabs.length;
                navTabs[nextIndex].focus();
                navTabs[nextIndex].click();
            }
        });
    });
    
    // Update ARIA attributes when tabs change
    const originalSwitchTab = window.switchTab;
    window.switchTab = function(tabName) {
        originalSwitchTab(tabName);
        navTabs.forEach(tab => {
            const tabId = tab.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
            tab.setAttribute('aria-selected', tabId === tabName ? 'true' : 'false');
        });
    };
});
