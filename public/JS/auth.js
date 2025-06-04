// Password validation regex
const passwordRegex = {
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
    minLength: /.{8,}/  // At least 8 characters
};

// Add rate limiting for login attempts
const loginAttempts = {
    count: 0,
    lastAttempt: 0,
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes in milliseconds
};

// Add input sanitization
function sanitizeInput(input)
{
    return input.trim().replace(/[<>]/g, '');
}

// Add secure password hashing (in a real app, this would be done server-side)
function hashPassword(password)
{
    // This is a simple hash for demonstration. In production, use a proper hashing library
    return btoa(password); // Base64 encoding (NOT secure, just for demo)
}

// Get users from localStorage or initialize empty array
const getUsers = () =>
{
    try
    {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    } catch (error)
    {
        console.error('Error reading users from localStorage:', error);
        return [];
    }
};

// Save users to localStorage
const saveUsers = (users) =>
{
    try
    {
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    } catch (error)
    {
        console.error('Error saving users to localStorage:', error);
        return false;
    }
};

// Handle signup form
const signupForm = document.getElementById('signupForm');
if (signupForm)
{
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorMessage = document.getElementById('signupError');
    const submitButton = signupForm.querySelector('button[type="submit"]');

    // Password requirement indicators
    const requirements = {
        uppercase: document.getElementById('uppercase'),
        number: document.getElementById('number'),
        special: document.getElementById('special'),
        minLength: document.getElementById('minLength')
    };

    // Update password requirements in real-time
    passwordInput.addEventListener('input', () =>
    {
        const password = passwordInput.value;
        let allValid = true;

        for (const [key, regex] of Object.entries(passwordRegex))
        {
            const isValid = regex.test(password);
            requirements[key].classList.toggle('valid', isValid);
            if (!isValid) allValid = false;
        }

        // Enable/disable submit button based on password validity
        submitButton.disabled = !allValid;
    });

    signupForm.addEventListener('submit', async (e) =>
    {
        e.preventDefault();
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';

        const name = sanitizeInput(document.getElementById('name').value);
        const email = sanitizeInput(document.getElementById('email').value);
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Custom form validation
        let isValid = true;
        let errorText = '';

        // Check for empty fields
        if (!name)
        {
            isValid = false;
            errorText = 'Please enter your name';
        } else if (!email)
        {
            isValid = false;
            errorText = 'Please enter your email';
        } else if (!password)
        {
            isValid = false;
            errorText = 'Please enter a password';
        } else if (!confirmPassword)
        {
            isValid = false;
            errorText = 'Please confirm your password';
        }

        if (password !== confirmPassword)
        {
            isValid = false;
            errorText = 'Passwords do not match';
        }

        for (const [key, regex] of Object.entries(passwordRegex))
        {
            if (!regex.test(password))
            {
                isValid = false;
                errorText = 'Password does not meet requirements';
                break;
            }
        }

        // Check if user already exists
        const users = getUsers();
        if (users.some(user => user.email === email))
        {
            isValid = false;
            errorText = 'Email already exists';
        }

        if (!isValid)
        {
            errorMessage.textContent = errorText;
            submitButton.disabled = false;
            submitButton.textContent = 'Sign Up';
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: hashPassword(password), // Hash password before storing
            wishlist: [],
            cart: [],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        const saved = saveUsers(users);

        if (saved)
        {
            // Set current user (without password)
            const { password: _, ...userWithoutPassword } = newUser;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

            // Show success message
            errorMessage.style.color = 'green';
            errorMessage.textContent = 'Account created successfully! Redirecting...';

            // Redirect to home page after a short delay
            setTimeout(() =>
            {
                window.location.href = 'index.html';
            }, 1500);
        } else
        {
            errorMessage.textContent = 'Error creating account. Please try again.';
            submitButton.disabled = false;
            submitButton.textContent = 'Sign Up';
        }
    });
}

// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm)
{
    loginForm.addEventListener('submit', async (e) =>
    {
        e.preventDefault();
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

        const email = sanitizeInput(document.getElementById('email').value);
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('loginError');

        // Check for rate limiting
        const now = Date.now();
        if (loginAttempts.count >= loginAttempts.maxAttempts)
        {
            const timeLeft = loginAttempts.lockoutDuration - (now - loginAttempts.lastAttempt);
            if (timeLeft > 0)
            {
                errorMessage.textContent = `Too many attempts. Please try again in ${Math.ceil(timeLeft / 60000)} minutes.`;
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
                return;
            } else
            {
                loginAttempts.count = 0;
            }
        }

        // Custom form validation
        let isValid = true;
        let errorText = '';

        if (!email)
        {
            isValid = false;
            errorText = 'Please enter your email';
        } else if (!password)
        {
            isValid = false;
            errorText = 'Please enter your password';
        }

        if (!isValid)
        {
            errorMessage.textContent = errorText;
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
            return;
        }

        // Find user
        const users = getUsers();
        const user = users.find(user => user.email === email);

        if (!user || user.password !== hashPassword(password))
        {
            loginAttempts.count++;
            loginAttempts.lastAttempt = now;
            errorMessage.textContent = 'Invalid email or password';
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
            return;
        }

        // Reset login attempts on successful login
        loginAttempts.count = 0;

        // Set current user (without password)
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

        // Show success message
        errorMessage.style.color = 'green';
        errorMessage.textContent = 'Login successful! Redirecting...';

        // Redirect to home page after a short delay
        setTimeout(() =>
        {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Toggle password visibility with improved accessibility
document.querySelectorAll('.toggle-password').forEach(toggle =>
{
    toggle.addEventListener('click', (e) =>
    {
        const input = e.target.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        e.target.classList.toggle('fa-eye');
        e.target.classList.toggle('fa-eye-slash');
        e.target.setAttribute('aria-label',
            type === 'password' ? 'Show password' : 'Hide password'
        );
    });
});
