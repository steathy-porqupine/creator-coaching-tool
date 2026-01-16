// Tab switching functionality
function switchTab(tabName) {
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

// Check practice response
function checkPractice(scenarioNum) {
    const textarea = document.getElementById('practice-' + scenarioNum);
    const feedback = document.getElementById('feedback-' + scenarioNum);
    
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
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
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
